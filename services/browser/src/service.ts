import type {
  Actions,
  BrowserColumn,
  BrowserCrumb,
  BrowserFetchParams,
  BrowserFetchResult,
  BrowserFolder,
  Config,
  Event,
  Events,
  Listener,
  Options,
  Service,
  Snapshot,
  SortDirection,
  State,
} from "./types";
import type { Service as Query } from "@zoobzio/query";
import type { Service as Sync } from "@zoobzio/sync";
import type { Emitter, Loader, Text } from "@zoobzio/kit";

import { entries } from "objectively";
import { QueryService } from "@zoobzio/query";
import { SyncService } from "@zoobzio/sync";
import { makeEmitter, makeLoader, makeProxy } from "@zoobzio/kit";
import {
  BROWSER_DEFAULT_CURRENCY,
  BROWSER_DEFAULT_LOCALE,
  BROWSER_DEFAULT_ROOT_LABEL,
  BROWSER_DEFAULT_TIME_ZONE,
  BROWSER_ROOT_KEY,
  BROWSER_STATE_FIELDS,
} from "./constants";
import { fields, prune } from "./util";

/**
 * The headless browser machine. Owns the folder trail, the sort, the
 * selection of folders and files, and the query over its columns; delegates data loading
 * to `wiring.fetch` and joins the config's action descriptors to the
 * handlers in `wiring`.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `updated`, `navigated`, and `filtered`. `on` subscribes.
 *
 * Where the wiring names a `refresh`, the browser has a sync: it polls the
 * refresh for what changed in the folder since the listing held was read,
 * on the interval a visitor sets, and every listing that lands marks it
 * anew.
 */
export class BrowserService<T> implements Service<T> {
  readonly columns: BrowserColumn<T>[];
  readonly fileKey: keyof T;
  readonly actions: Service<T>["actions"];
  readonly folderActions: Service<T>["folderActions"];
  readonly bulkActions: Service<T>["bulkActions"];
  readonly query: Query;
  readonly sync: Sync | undefined;

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();
  /**
   * The order between the fetches and the sync's refreshes: a fetch that
   * settles after a later one began is dropped, and a refresh is quiet,
   * and dropped where the browser has moved on since it was asked.
   */
  private readonly loader: Loader<BrowserFetchResult<T>>;

  /**
   * Set while the trail moves or a snapshot is restored: either fetches
   * once itself, so the query it writes on the way does not fetch a
   * second time.
   */
  private moving = false;

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly wiring: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, BROWSER_STATE_FIELDS, options, this.emitter);

    this.columns = config.columns;
    this.fileKey = config.fileKey;
    this.actions = entries(config.actions ?? {}).map(([key, descriptor]) => ({
      ...descriptor,
      key,
      action: (row: T) => this.runAction(key, row),
    }));
    this.folderActions = entries(config.folderActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        key,
        action: (folder: BrowserFolder<T>) => this.runFolderAction(key, folder),
      }),
    );
    this.bulkActions = entries(config.bulkActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        key,
        action: (selected: Set<string>, folders: Set<string>) =>
          wiring.bulkActions?.[key]?.(selected, folders),
      }),
    );

    this.query = new QueryService(
      `${id}-query`,
      {
        fields: fields(this.filterableColumns, this.timeZone),
        ...(config.literals && { literals: config.literals }),
      },
      this.state,
    );
    this.query.on("changed", () => this.refilter());

    const { refresh } = wiring;
    this.loader = makeLoader<BrowserFetchParams, BrowserFetchResult<T>>(
      this.state,
      {
        params: () => this.params(),
        fetch: (params) => wiring.fetch(params, this),
        ...(refresh && {
          refresh: (params, since) => refresh({ ...params, since }, this),
        }),
        land: (result, at) => this.land(result, at),
        settled: () => this.emitUpdated(),
      },
    );

    this.sync = refresh
      ? new SyncService(`${id}-sync`, config.sync ?? {}, this.state, {
          poll: (since) => this.loader.refresh(since),
        })
      : undefined;
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get folders(): BrowserFolder<T>[] {
    return this.state.folders;
  }
  get files(): T[] {
    return this.state.files;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get path(): BrowserCrumb[] {
    return this.state.path;
  }
  get sortField(): string | null {
    return this.state.sortField;
  }
  get sortDirection(): SortDirection {
    return this.state.sortDirection;
  }
  get selected(): Set<string> {
    return this.state.selected;
  }
  get selectedFolders(): Set<string> {
    return this.state.selectedFolders;
  }
  get rootLabel(): Text {
    return this.config.rootLabel ?? BROWSER_DEFAULT_ROOT_LABEL;
  }
  get searchable(): boolean {
    return this.config.searchable ?? true;
  }
  get locale(): string {
    return this.config.locale ?? BROWSER_DEFAULT_LOCALE;
  }
  get currency(): string {
    return this.config.currency ?? BROWSER_DEFAULT_CURRENCY;
  }
  get timeZone(): string {
    return this.config.timeZone ?? BROWSER_DEFAULT_TIME_ZONE;
  }

  // --- derived ---------------------------------------------------------

  get pathKeys(): string[] {
    return this.path.map((crumb) => crumb.key);
  }

  get depth(): number {
    return this.path.length;
  }

  get trail(): BrowserCrumb[] {
    const keys = this.pathKeys;
    return [
      {
        key: BROWSER_ROOT_KEY,
        label: this.rootLabel,
        link: this.config.rootLink,
      },
      ...this.path.map((crumb, index) => ({
        key: keys.slice(0, index + 1).join("/"),
        label: crumb.label,
        link: crumb.link,
      })),
    ];
  }

  get filterableColumns(): BrowserColumn<T>[] {
    return this.columns.filter(
      (c) => c.filterable ?? (c.type !== "action" && c.type !== "image"),
    );
  }

  get sortableColumns(): BrowserColumn<T>[] {
    return this.columns.filter((c) => c.sortable);
  }

  get isFiltered(): boolean {
    return this.state.clauses.length > 0;
  }

  get isAllSelected(): boolean {
    if (!this.folders.length && !this.files.length) return false;
    return (
      this.folders.every((folder) => this.selectedFolders.has(folder.key)) &&
      this.files.every((row) => this.selected.has(this.keyOf(row)))
    );
  }

  get isIndeterminate(): boolean {
    if (!this.hasSelection) return false;
    return !this.isAllSelected;
  }

  get selectAllState(): boolean | "indeterminate" {
    if (this.isIndeterminate) return "indeterminate";
    return this.isAllSelected;
  }

  get colSpan(): number {
    return (
      this.columns.length +
      (this.hasActions || this.hasFolderActions ? 1 : 0) +
      (this.isSelectable ? 1 : 0)
    );
  }

  get hasSelection(): boolean {
    return this.selectionCount > 0;
  }

  get selectionCount(): number {
    return this.selected.size + this.selectedFolders.size;
  }

  get isSelectable(): boolean {
    return this.bulkActions.length > 0;
  }

  get hasActions(): boolean {
    return this.actions.length > 0;
  }

  get hasFolderActions(): boolean {
    return this.folderActions.length > 0;
  }

  get isEmpty(): boolean {
    return (
      this.initialized &&
      !this.loading &&
      !this.folders.length &&
      !this.files.length
    );
  }

  keyOf(row: T): string {
    return String(row[this.config.fileKey]);
  }

  // --- navigation ------------------------------------------------------

  /**
   * Descends into a folder: push its crumb, drop the selection and the
   * search, refetch.
   */
  open(folder: BrowserFolder<T>): void {
    this.move([
      ...this.path,
      { key: folder.key, label: folder.label, link: folder.link },
    ]);
  }

  /**
   * Jumps to a trail position: `0` is the root, `depth` is where the
   * browser already stands (a no-op, like clicking the current crumb).
   */
  navigate(index: number): void {
    if (index < 0 || index >= this.depth) return;
    this.move(this.path.slice(0, index));
  }

  /**
   * Moves the trail. The selection and the search belong to the folder
   * they were made in, so both are dropped: the committed clauses (which
   * emits `filtered`) and the draft being typed. One fetch follows.
   */
  private move(path: BrowserCrumb[]): void {
    this.state.path = path;
    this.clearSelection();
    this.moving = true;
    try {
      this.query.clear();
      this.query.setDraft("");
    } finally {
      this.moving = false;
    }
    this.fetch();
    this.emitter.emit("navigated", { id: this.id, path: this.pathKeys });
  }

  // --- search ----------------------------------------------------------

  private refilter(): void {
    if (!this.moving) this.fetch();
    this.emitter.emit("filtered", {
      id: this.id,
      query: this.query.text,
      filters: this.query.filters,
    });
  }

  // --- sorting ---------------------------------------------------------

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.state.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField = field;
      this.state.sortDirection = "asc";
    }
    this.fetch();
  }

  sortFieldFor(col: BrowserColumn<T>): string {
    return col.sortKey ?? String(col.key);
  }

  isSorted(col: BrowserColumn<T>): boolean {
    return this.sortField === this.sortFieldFor(col);
  }

  // --- selection -------------------------------------------------------

  toggleRow(key: string): void {
    const next = new Set(this.selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.state.selected = next;
  }

  toggleFolder(key: string): void {
    const next = new Set(this.selectedFolders);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.state.selectedFolders = next;
  }

  toggleAll(): void {
    if (this.isAllSelected) {
      this.clearSelection();
    } else {
      this.state.selected = new Set(this.files.map((row) => this.keyOf(row)));
      this.state.selectedFolders = new Set(
        this.folders.map((folder) => folder.key),
      );
    }
  }

  clearSelection(): void {
    this.state.selected = new Set();
    this.state.selectedFolders = new Set();
  }

  isRowSelected(row: T): boolean {
    return this.selected.has(this.keyOf(row));
  }

  isFolderSelected(folder: BrowserFolder<T>): boolean {
    return this.selectedFolders.has(folder.key);
  }

  /**
   * Narrows the selection to the listing: a row a fetch no longer returns
   * (a search hid it, a refresh found it gone) leaves the selection with
   * it. A set that loses nothing is left as it stands.
   */
  private pruneSelection(): void {
    const files = prune(
      this.selected,
      this.files.map((row) => this.keyOf(row)),
    );
    if (files !== this.selected) this.state.selected = files;
    const folders = prune(
      this.selectedFolders,
      this.folders.map((folder) => folder.key),
    );
    if (folders !== this.selectedFolders) this.state.selectedFolders = folders;
  }

  // --- actions ---------------------------------------------------------

  runAction(key: string, row: T): void {
    this.wiring.actions?.[key]?.(row);
  }

  runFolderAction(key: string, folder: BrowserFolder<T>): void {
    this.wiring.folderActions?.[key]?.(folder);
  }

  runBulkAction(key: string): void {
    this.wiring.bulkActions?.[key]?.(this.selected, this.selectedFolders);
  }

  // --- views -----------------------------------------------------------

  snapshot(): Snapshot {
    return {
      sortField: this.state.sortField,
      sortDirection: this.state.sortDirection,
      clauses: this.state.clauses,
      interval: this.state.interval,
    };
  }

  restore(snapshot: Snapshot): void {
    this.state.sortField = snapshot.sortField;
    this.state.sortDirection = snapshot.sortDirection;
    this.sync?.setInterval(snapshot.interval);
    this.moving = true;
    try {
      this.query.replace(snapshot.clauses);
    } finally {
      this.moving = false;
    }
    if (this.initialized) void this.fetch();
    this.emitter.emit("restored", { id: this.id, snapshot: this.snapshot() });
  }

  // --- loading ---------------------------------------------------------

  init(): Promise<boolean> {
    return this.loader.init();
  }

  fetch(): Promise<void> {
    return this.loader.fetch();
  }

  /** What the fetch is handed, as the container stands. */
  private params(): BrowserFetchParams {
    return {
      path: this.pathKeys,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      query: this.query.text,
      filters: this.query.filters,
    };
  }

  /**
   * Lands a listing, and marks the sync with it: the result's own `since`,
   * or `at`, the time its request was made, so a change made while the
   * request was out is not passed over.
   */
  private land(result: BrowserFetchResult<T>, at: string): void {
    // The order of each section is the fetch's to decide.
    this.state.folders = result.folders;
    this.state.files = result.files;
    this.pruneSelection();
    this.sync?.mark(result.since ?? at);
  }

  private emitUpdated(): void {
    this.emitter.emit("updated", {
      id: this.id,
      path: this.pathKeys,
      folders: this.folders.length,
      files: this.files.length,
    });
  }
}
