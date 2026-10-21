import type {
  Actions,
  Config,
  DataDeckFetchParams,
  DateFieldConfig,
  Event,
  Events,
  FacetGroup,
  Listener,
  MatchMode,
  Options,
  Service,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import {
  DECK_PAGE_SIZE,
  DECK_POLL_INTERVAL,
  DECK_STATE_FIELDS,
} from "./constants";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { sortLabel } from "./util";

/**
 * The headless deck machine. Owns the cursor feed, the pending buffer,
 * sort, and the committed search (query, keywords, match, facets);
 * delegates data loading to `actions.fetch`. Timers stay outside: `poll()`
 * is a single pure step for a caller's interval.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `updated`, `polled`, and `failed`. `on`
 * subscribes.
 */
export class DeckService<T> implements Service<T> {
  readonly pollInterval: number;
  readonly pageSize: number;

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly actions: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, DECK_STATE_FIELDS, options, this.emitter);
    this.pollInterval = config.pollInterval ?? DECK_POLL_INTERVAL;
    this.pageSize = config.pageSize ?? DECK_PAGE_SIZE;
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- config ----------------------------------------------------------

  get topic(): string {
    return this.config.topic;
  }
  get rowKey(): keyof T {
    return this.config.rowKey;
  }
  get dateFields(): DateFieldConfig<T>[] {
    return this.config.dateFields;
  }

  // --- state -----------------------------------------------------------

  get items(): T[] {
    return this.state.items;
  }
  get pending(): T[] {
    return this.state.pending;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get loadingMore(): boolean {
    return this.state.loadingMore;
  }
  get hasMore(): boolean {
    return this.state.hasMore;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get query(): string {
    return this.state.query;
  }
  set query(query: string) {
    this.setQuery(query);
  }
  get keywords(): string {
    return this.state.keywords;
  }
  set keywords(keywords: string) {
    this.setKeywords(keywords);
  }
  get match(): MatchMode {
    return this.state.match;
  }
  set match(match: MatchMode) {
    this.setMatch(match);
  }
  get selectedFacets(): Set<string> {
    return this.state.selectedFacets;
  }
  set selectedFacets(facets: Set<string>) {
    this.setFacets(facets);
  }
  get facetGroups(): FacetGroup[] {
    return this.state.facetGroups;
  }
  get sortField(): string {
    return this.state.sortField;
  }
  set sortField(field: string) {
    this.setSortField(field);
  }

  // --- derived ---------------------------------------------------------

  get title(): string {
    const field = this.config.dateFields.find(
      (f) => String(f.key) === this.sortField,
    );
    const label = field?.label ?? sortLabel(this.sortField);
    return `Recently ${label} ${this.config.topic}`;
  }

  get pendingCount(): number {
    return this.pending.length;
  }

  // The active sort field as a real key of T — resolved through the config so
  // rows can be indexed for cursors without a cast.
  private sortKey(): keyof T | undefined {
    return this.config.dateFields.find((f) => String(f.key) === this.sortField)
      ?.key;
  }

  private baseParams(): Omit<DataDeckFetchParams, "after" | "before"> {
    return {
      limit: this.pageSize,
      sortField: this.sortField,
      query: this.query,
      keywords: this.keywords,
      match: this.match,
      facets: this.selectedFacets,
    };
  }

  // --- loading ---------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;
    this.state.initialized = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading = true;
    try {
      const result = await this.actions.fetch(this.baseParams(), this);
      this.state.items = result.data;
      this.state.hasMore = result.hasMore;
      this.state.pending = [];
      if (result.facets) this.state.facetGroups = result.facets;
    } finally {
      this.state.loading = false;
      this.emitter.emit("updated", { id: this.id, count: this.items.length });
    }
  }

  async loadMore(): Promise<void> {
    if (this.loadingMore || !this.hasMore || !this.items.length) return;
    const oldest = this.items[this.items.length - 1];
    const field = this.sortKey();
    if (!oldest || !field) return;

    this.state.loadingMore = true;
    try {
      const result = await this.actions.fetch(
        { ...this.baseParams(), before: String(oldest[field]) },
        this,
      );
      this.state.items = [...this.items, ...result.data];
      this.state.hasMore = result.hasMore;
      if (result.facets) this.state.facetGroups = result.facets;
    } finally {
      this.state.loadingMore = false;
    }
  }

  async poll(): Promise<void> {
    if (!this.items.length) return;
    const newest = this.items[0];
    const field = this.sortKey();
    if (!newest || !field) return;

    try {
      const result = await this.actions.fetch(
        { ...this.baseParams(), after: String(newest[field]) },
        this,
      );
      if (result.data.length) {
        this.state.pending = [...result.data, ...this.pending];
        this.emitter.emit("polled", { id: this.id, count: result.data.length });
      }
      if (result.facets) this.state.facetGroups = result.facets;
    } catch (cause) {
      // A poll failure is reported, not thrown — the caller's interval
      // survives and the next tick retries.
      this.emitter.emit("failed", { id: this.id, cause });
    }
  }

  showPending(): void {
    this.state.items = [...this.pending, ...this.items];
    this.state.pending = [];
  }

  // --- search ----------------------------------------------------------

  setSortField(field: string): void {
    if (!this.config.dateFields.some((f) => String(f.key) === field)) return;
    this.state.sortField = field;
    this.fetch();
  }

  setQuery(query: string): void {
    this.state.query = query;
    this.fetch();
  }

  setKeywords(keywords: string): void {
    this.state.keywords = keywords;
    this.fetch();
  }

  setMatch(match: MatchMode): void {
    this.state.match = match;
    this.fetch();
  }

  setFacets(facets: Set<string>): void {
    this.state.selectedFacets = facets;
    this.fetch();
  }
}
