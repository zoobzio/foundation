import type {
  Actions,
  Config,
  DataTableColumn,
  Event,
  Events,
  Listener,
  Options,
  Service,
  State,
  TableFilter,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { entries } from "objectively";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { TABLE_STATE_FIELDS } from "./constants";

/**
 * The headless table machine. Owns paging, sort, selection, column order,
 * and committed search; delegates data loading to `wiring.fetch`.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `updated` and `filtered`. `on` subscribes.
 */
export class TableService<T> implements Service<T> {
  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: Service<T>["actions"];
  readonly bulkActions: Service<T>["bulkActions"];
  readonly pinnedColumns: (keyof T)[];

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

  private readonly columnMap: Map<string, DataTableColumn<T>>;
  private readonly pinnedSet: Set<string>;
  private readonly defaultColumnKeys: string[];

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly wiring: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, TABLE_STATE_FIELDS, options, this.emitter);
    this.columns = config.columns;
    this.rowKey = config.rowKey;
    this.actions = entries(config.actions ?? {}).map(([key, descriptor]) => ({
      ...descriptor,
      action: (row: T) => wiring.actions?.[key]?.(row),
    }));
    this.bulkActions = entries(config.bulkActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        action: (selected: Set<string>) =>
          wiring.bulkActions?.[key]?.(selected),
      }),
    );
    this.pinnedColumns = config.pinnedColumns ?? [];

    this.columnMap = new Map(config.columns.map((c) => [String(c.key), c]));
    this.pinnedSet = new Set(this.pinnedColumns.map(String));
    this.defaultColumnKeys = (
      config.defaultColumnOrder ?? config.columns.map((c) => c.key)
    ).map(String);
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get data(): T[] {
    return this.state.data;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get initialized(): boolean {
    return this.state.initialized;
  }
  get page(): number {
    return this.state.page;
  }
  get pageSize(): number {
    return this.state.pageSize;
  }
  get total(): number {
    return this.state.total;
  }
  get pageCount(): number {
    return this.state.pageCount;
  }
  get sortField(): string | null {
    return this.state.sortField;
  }
  get sortDirection() {
    return this.state.sortDirection;
  }
  get selected(): Set<string> {
    return this.state.selected;
  }
  get columnOrder(): string[] {
    return this.state.columnOrder;
  }
  get searchable(): boolean {
    return this.config.searchable ?? true;
  }
  get query(): string {
    return this.state.query;
  }
  get filters(): TableFilter[] {
    return this.state.filters;
  }

  // --- derived ---------------------------------------------------------

  get filterableColumns(): DataTableColumn<T>[] {
    return this.columns.filter(
      (c) => c.filterable ?? (c.type !== "action" && c.type !== "image"),
    );
  }

  get visibleColumns(): DataTableColumn<T>[] {
    return this.columnOrder
      .map((key) => this.columnMap.get(key))
      .filter((c): c is DataTableColumn<T> => c !== undefined);
  }

  get isAllSelected(): boolean {
    if (!this.data.length) return false;
    return this.data.every((row) => this.selected.has(this.keyOf(row)));
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
      this.visibleColumns.length +
      (this.actions.length ? 1 : 0) +
      (this.bulkActions.length ? 1 : 0)
    );
  }

  keyOf(row: T): string {
    return String(row[this.config.rowKey]);
  }

  // --- paging ----------------------------------------------------------

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.state.page = page;
    this.fetch();
  }

  setPageSize(size: number): void {
    this.state.pageSize = size;
    this.state.page = 1;
    this.fetch();
  }

  // --- sorting ---------------------------------------------------------

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.state.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField = field;
      this.state.sortDirection = "asc";
    }
    this.state.page = 1;
    this.fetch();
  }

  sortFieldFor(col: DataTableColumn<T>): string {
    return col.sortKey ?? String(col.key);
  }

  isSorted(col: DataTableColumn<T>): boolean {
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
      this.state.selected = new Set(this.data.map((row) => this.keyOf(row)));
    }
  }

  clearSelection(): void {
    this.state.selected = new Set();
  }

  isRowSelected(row: T): boolean {
    return this.selected.has(this.keyOf(row));
  }

  // --- columns ---------------------------------------------------------

  isColumnPinned(key: keyof T): boolean {
    return this.pinnedSet.has(String(key));
  }

  isColumnVisible(key: keyof T): boolean {
    return this.columnOrder.includes(String(key));
  }

  toggleColumn(key: keyof T): void {
    const k = String(key);
    if (this.pinnedSet.has(k)) return;
    if (this.columnOrder.includes(k)) {
      this.state.columnOrder = this.columnOrder.filter((c) => c !== k);
    } else {
      this.state.columnOrder = [...this.columnOrder, k];
    }
  }

  reorderColumns(order: string[]): void {
    this.state.columnOrder = order;
  }

  resetColumns(): void {
    this.state.columnOrder = this.defaultColumnKeys;
  }

  // --- search ----------------------------------------------------------

  /**
   * Commits a filter; a filter with the same key and operator is replaced
   * and moved to the end, so order tracks recency (the freshest filter is
   * the first to unwrap) while distinct operators on one key (a date/number
   * range) coexist.
   */
  addFilter(key: string, value: string, op?: string): void {
    const next: TableFilter = op ? { key, op, value } : { key, value };
    this.state.filters = [
      ...this.filters.filter((f) => !(f.key === key && f.op === op)),
      next,
    ];
    this.search();
  }

  removeFilter(index: number): void {
    if (index < 0 || index >= this.filters.length) return;
    this.state.filters = this.filters.filter((_, i) => i !== index);
    this.search();
  }

  setQuery(value: string): void {
    if (value === this.query) return;
    this.state.query = value;
    this.search();
  }

  /** First page, refetch, emit — the same reset discipline as `sortBy`. */
  private search(): void {
    this.state.page = 1;
    this.fetch();
    this.emitter.emit("filtered", {
      id: this.id,
      query: this.query,
      filters: this.filters,
    });
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
          page: this.page,
          pageSize: this.pageSize,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
          query: this.query,
          filters: this.filters,
        },
        this,
      );
      this.state.data = result.data;
      this.state.total = result.total;
      this.state.pageCount = result.pageCount;
    } finally {
      this.state.loading = false;
      this.emitter.emit("updated", { id: this.id, total: this.total });
    }
  }
}
