import type { NuxtApp } from "#app";
import type {
  Actions,
  Config,
  DataDeckFetchParams,
  MatchMode,
  Service,
  State,
} from "#foundation/types/data/deck";
import type { Logger } from "#foundation/types/log";

import {
  DECK_PAGE_SIZE,
  DECK_POLL_INTERVAL,
  SORT_LABELS,
} from "#foundation/constants/deck";

const sortLabel = (field: string): string =>
  SORT_LABELS[field] ?? field.charAt(0).toUpperCase() + field.slice(1);

export class DeckService<T> implements Service<T> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  readonly pollInterval: number;
  readonly pageSize: number;

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<T>,
    private readonly state: State<T>,
    private readonly actions: Actions<T>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;
    this.pollInterval = config.pollInterval ?? DECK_POLL_INTERVAL;
    this.pageSize = config.pageSize ?? DECK_PAGE_SIZE;
  }

  get topic(): string {
    return this.config.topic;
  }
  get rowKey(): keyof T {
    return this.config.rowKey;
  }
  get dateFields() {
    return this.config.dateFields;
  }

  get items(): T[] {
    return this.state.items.value;
  }
  get pending(): T[] {
    return this.state.pending.value;
  }
  get loading(): boolean {
    return this.state.loading.value;
  }
  get loadingMore(): boolean {
    return this.state.loadingMore.value;
  }
  get hasMore(): boolean {
    return this.state.hasMore.value;
  }
  get initialized(): boolean {
    return this.state.initialized.value;
  }
  get query(): string {
    return this.state.query.value;
  }
  get keywords(): string {
    return this.state.keywords.value;
  }
  get match(): MatchMode {
    return this.state.match.value;
  }
  get selectedFacets(): Set<string> {
    return this.state.selectedFacets.value;
  }
  get facetGroups() {
    return this.state.facetGroups.value;
  }
  get sortField(): string {
    return this.state.sortField.value;
  }

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

  async init(): Promise<boolean> {
    if (this.state.initialized.value) return true;
    this.state.initialized.value = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading.value = true;
    try {
      const result = await this.actions.fetch(this.baseParams(), this);
      this.state.items.value = result.data;
      this.state.hasMore.value = result.hasMore;
      this.state.pending.value = [];
      if (result.facets) this.state.facetGroups.value = result.facets;
    } finally {
      this.state.loading.value = false;
      this.log.debug("Deck updated", { id: this.id, count: this.items.length });
      this.emit("deck:updated", { id: this.id, count: this.items.length });
    }
  }

  async loadMore(): Promise<void> {
    if (this.loadingMore || !this.hasMore || !this.items.length) return;
    const oldest = this.items[this.items.length - 1];
    const field = this.sortKey();
    if (!oldest || !field) return;

    this.state.loadingMore.value = true;
    try {
      const result = await this.actions.fetch(
        { ...this.baseParams(), before: String(oldest[field]) },
        this,
      );
      this.state.items.value = [...this.items, ...result.data];
      this.state.hasMore.value = result.hasMore;
      if (result.facets) this.state.facetGroups.value = result.facets;
    } finally {
      this.state.loadingMore.value = false;
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
        this.state.pending.value = [...result.data, ...this.pending];
        this.log.debug("Deck polled", { id: this.id, count: result.data.length });
        this.emit("deck:polled", { id: this.id, count: result.data.length });
      }
      if (result.facets) this.state.facetGroups.value = result.facets;
    } catch {
      // Polling errors are silent — the next interval retries.
    }
  }

  showPending(): void {
    this.state.items.value = [...this.pending, ...this.items];
    this.state.pending.value = [];
  }

  setSortField(field: string): void {
    if (!this.config.dateFields.some((f) => String(f.key) === field)) return;
    this.state.sortField.value = field;
    this.fetch();
  }

  setQuery(query: string): void {
    this.state.query.value = query;
    this.fetch();
  }

  setKeywords(keywords: string): void {
    this.state.keywords.value = keywords;
    this.fetch();
  }

  setMatch(match: MatchMode): void {
    this.state.match.value = match;
    this.fetch();
  }

  setFacets(facets: Set<string>): void {
    this.state.selectedFacets.value = facets;
    this.fetch();
  }
}
