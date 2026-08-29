import type { NuxtApp } from "#app";
import type {
  Actions,
  Config,
  DataTableColumn,
  Service,
  State,
  TableFilter,
} from "../types/data/table";
import type { IconAlias } from "../types/icon";
import type { Logger } from "../types/log";

import { entries } from "objectively";
import { TABLE_SORT_ASC_ICON, TABLE_SORT_DESC_ICON } from "../constants/table";

export class TableService<T> implements Service<T> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: Service<T>["actions"];
  readonly bulkActions: Service<T>["bulkActions"];
  readonly pinnedColumns: (keyof T)[];

  private readonly columnMap: Map<string, DataTableColumn<T>>;
  private readonly pinnedSet: Set<string>;
  private readonly defaultColumnKeys: string[];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<T>,
    private readonly state: State<T>,
    private readonly wiring: Actions<T>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;

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

  get data(): T[] {
    return this.state.data.value;
  }
  get loading(): boolean {
    return this.state.loading.value;
  }
  get initialized(): boolean {
    return this.state.initialized.value;
  }
  get page(): number {
    return this.state.page.value;
  }
  get pageSize(): number {
    return this.state.pageSize.value;
  }
  get total(): number {
    return this.state.total.value;
  }
  get pageCount(): number {
    return this.state.pageCount.value;
  }
  get sortField(): string | null {
    return this.state.sortField.value;
  }
  get sortDirection() {
    return this.state.sortDirection.value;
  }
  get selected(): Set<string> {
    return this.state.selected.value;
  }
  get columnOrder(): string[] {
    return this.state.columnOrder.value;
  }
  get searchable(): boolean {
    return this.config.searchable ?? true;
  }
  get query(): string {
    return this.state.query.value;
  }
  get filters(): TableFilter[] {
    return this.state.filters.value;
  }

  get filterableColumns(): DataTableColumn<T>[] {
    return this.columns.filter(
      (c) => c.filterable ?? (c.type !== "action" && c.type !== "image"),
    );
  }

  get visibleColumns(): DataTableColumn<T>[] {
    return this.state.columnOrder.value
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

  goToPage(page: number): void {
    if (page < 1 || page > this.pageCount) return;
    this.state.page.value = page;
    this.fetch();
  }

  setPageSize(size: number): void {
    this.state.pageSize.value = size;
    this.state.page.value = 1;
    this.fetch();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.state.sortDirection.value =
        this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField.value = field;
      this.state.sortDirection.value = "asc";
    }
    this.state.page.value = 1;
    this.fetch();
  }

  sortFieldFor(col: DataTableColumn<T>): string {
    return col.sortKey ?? String(col.key);
  }

  isSorted(col: DataTableColumn<T>): boolean {
    return this.sortField === this.sortFieldFor(col);
  }

  getSortIcon(): IconAlias {
    return this.sortDirection === "asc"
      ? TABLE_SORT_ASC_ICON
      : TABLE_SORT_DESC_ICON;
  }

  toggleRow(key: string): void {
    const next = new Set(this.selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.state.selected.value = next;
  }

  toggleAll(): void {
    if (this.isAllSelected) {
      this.state.selected.value = new Set();
    } else {
      this.state.selected.value = new Set(
        this.data.map((row) => this.keyOf(row)),
      );
    }
  }

  clearSelection(): void {
    this.state.selected.value = new Set();
  }

  isRowSelected(row: T): boolean {
    return this.selected.has(this.keyOf(row));
  }

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
      this.state.columnOrder.value = this.columnOrder.filter((c) => c !== k);
    } else {
      this.state.columnOrder.value = [...this.columnOrder, k];
    }
  }

  reorderColumns(order: string[]): void {
    this.state.columnOrder.value = order;
  }

  resetColumns(): void {
    this.state.columnOrder.value = this.defaultColumnKeys;
  }

  /**
   * Commits a filter; a filter with the same key and operator is replaced
   * and moved to the end, so order tracks recency (the freshest filter is
   * the first to unwrap) while distinct operators on one key (a date/number
   * range) coexist.
   */
  addFilter(key: string, value: string, op?: string): void {
    const next: TableFilter = op ? { key, op, value } : { key, value };
    this.state.filters.value = [
      ...this.filters.filter((f) => !(f.key === key && f.op === op)),
      next,
    ];
    this.search();
  }

  removeFilter(index: number): void {
    if (index < 0 || index >= this.filters.length) return;
    this.state.filters.value = this.filters.filter((_, i) => i !== index);
    this.search();
  }

  setQuery(value: string): void {
    if (value === this.query) return;
    this.state.query.value = value;
    this.search();
  }

  /** First page, refetch, emit — the same reset discipline as `sortBy`. */
  private search(): void {
    this.state.page.value = 1;
    this.fetch();
    this.log.debug("Table filtered", {
      id: this.id,
      query: this.query,
      filters: this.filters,
    });
    this.emit("table:filtered", {
      id: this.id,
      query: this.query,
      filters: this.filters,
    });
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
      this.state.data.value = result.data;
      this.state.total.value = result.total;
      this.state.pageCount.value = result.pageCount;
    } finally {
      this.state.loading.value = false;
      this.log.debug("Table updated", { id: this.id, total: this.total });
      this.emit("table:updated", { id: this.id, total: this.total });
    }
  }
}
