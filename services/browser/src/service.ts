import type {
  ActionDescriptor,
  Actions,
  BrowserColumn,
  BrowserCrumb,
  BrowserFolder,
  BulkAction,
  Config,
  Event,
  Events,
  FileAction,
  FolderAction,
  Listener,
  Options,
  Service,
  SortDirection,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { entries } from "objectively";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { BROWSER_STATE_FIELDS } from "./constants";
import { sortFolders } from "./util";

/**
 * The headless browser machine. Owns the folder trail, the file sort, and
 * the file selection; delegates data loading to `actions.fetch` and joins
 * the config's action descriptors to the handlers in `actions`.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `updated` and `navigated`. `on` subscribes.
 */
export class BrowserService<T> implements Service<T> {
  readonly columns: BrowserColumn<T>[];
  readonly fileKey: keyof T;
  readonly actions: FileAction<T>[];
  readonly folderActions: FolderAction[];
  readonly bulkActions: BulkAction[];

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

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
    this.actions = entries(config.actions ?? {}).map(
      ([key, descriptor]: [string, ActionDescriptor]) => ({
        ...descriptor,
        action: (row: T) => wiring.actions?.[key]?.(row),
      }),
    );
    this.folderActions = entries(config.folderActions ?? {}).map(
      ([key, descriptor]: [string, ActionDescriptor]) => ({
        ...descriptor,
        action: (folder: BrowserFolder) =>
          wiring.folderActions?.[key]?.(folder),
      }),
    );
    this.bulkActions = entries(config.bulkActions ?? {}).map(
      ([key, descriptor]: [string, ActionDescriptor]) => ({
        ...descriptor,
        action: (selected: Set<string>) =>
          wiring.bulkActions?.[key]?.(selected),
      }),
    );
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get folders(): BrowserFolder[] {
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

  // --- derived ---------------------------------------------------------

  get pathKeys(): string[] {
    return this.path.map((crumb) => crumb.key);
  }

  get depth(): number {
    return this.path.length;
  }

  get isAllSelected(): boolean {
    if (!this.files.length) return false;
    return this.files.every((row) => this.selected.has(this.keyOf(row)));
  }

  get isIndeterminate(): boolean {
    if (!this.selected.size) return false;
    return !this.isAllSelected;
  }

  get selectAllState(): boolean | "indeterminate" {
    if (this.isIndeterminate) return "indeterminate";
    return this.isAllSelected;
  }

  get colSpan(): number {
    return (
      this.columns.length +
      (this.actions.length || this.folderActions.length ? 1 : 0) +
      (this.bulkActions.length ? 1 : 0)
    );
  }

  keyOf(row: T): string {
    return String(row[this.config.fileKey]);
  }

  // --- navigation ------------------------------------------------------

  /** Descends into a folder: push its crumb, drop the selection, refetch. */
  open(folder: BrowserFolder): void {
    this.state.path = [...this.path, { key: folder.key, label: folder.label }];
    this.state.selected = new Set();
    this.fetch();
    this.emitter.emit("navigated", { id: this.id, path: this.pathKeys });
  }

  /**
   * Jumps to a trail position: `0` is the root, `depth` is where the
   * browser already stands (a no-op, like clicking the current crumb).
   */
  navigate(index: number): void {
    if (index < 0 || index >= this.depth) return;
    this.state.path = this.path.slice(0, index);
    this.state.selected = new Set();
    this.fetch();
    this.emitter.emit("navigated", { id: this.id, path: this.pathKeys });
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

  toggleAll(): void {
    if (this.isAllSelected) {
      this.state.selected = new Set();
    } else {
      this.state.selected = new Set(this.files.map((row) => this.keyOf(row)));
    }
  }

  clearSelection(): void {
    this.state.selected = new Set();
  }

  isRowSelected(row: T): boolean {
    return this.selected.has(this.keyOf(row));
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
      const result = await this.wiring.fetch(
        {
          path: this.pathKeys,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },
        this,
      );
      // Folders render alphabetically no matter what order the fetch
      // returns; file order is the fetch's to decide.
      this.state.folders = sortFolders(result.folders);
      this.state.files = result.files;
    } finally {
      this.state.loading = false;
      this.emitter.emit("updated", {
        id: this.id,
        path: this.pathKeys,
        folders: this.folders.length,
        files: this.files.length,
      });
    }
  }
}
