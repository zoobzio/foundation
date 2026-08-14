import type { NuxtApp } from "#app";
import type {
  Actions,
  Config,
  DataTableColumn,
  Service,
  State,
} from "../types/data/table";
import type { IconAlias } from "../types/common/iconic";
import type { Logger } from "../types/log";

import {
  TABLE_SORT_ASC_ICON,
  TABLE_SORT_DESC_ICON,
} from "../constants/table";

export class TableService<T, K = unknown> implements Service<T, K> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  readonly columns: DataTableColumn<T>[];
  readonly rowKey: keyof T;
  readonly actions: Service<T, K>["actions"];
  readonly bulkActions: Service<T, K>["bulkActions"];
  readonly pinnedColumns: (keyof T)[];

  private readonly columnMap: Map<string, DataTableColumn<T>>;
  private readonly pinnedSet: Set<string>;
  private readonly defaultColumnKeys: string[];

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<T, K>,
    private readonly state: State<T, K>,
    private readonly fetchAction: Actions<T, K>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;

    this.columns = config.columns;
    this.rowKey = config.rowKey;
    this.actions = config.actions ?? [];
    this.bulkActions = config.bulkActions ?? [];
    this.pinnedColumns = config.pinnedColumns ?? [];

    this.columnMap = new Map(config.columns.map((c) => [String(c.key), c]));
    this.pinnedSet = new Set(this.pinnedColumns.map(String));
    this.defaultColumnKeys = (
      config.defaultColumnOrder ?? config.columns.map((c) => c.key)
    ).map(String);
  }

  // The row's key as K — the one inherent assertion of the K/rowKey design (K
  // is the consumer-declared type of the rowKey field, unlinked structurally).
  // Every selection path routes through here, so the cast lives in one place.
  keyOf(row: T): K {
    return row[this.config.rowKey] as K;
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
  get selected(): Set<K> {
    return this.state.selected.value;
  }
  get columnOrder(): string[] {
    return this.state.columnOrder.value;
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

  toggleRow(key: K): void {
    const next = new Set(this.selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.state.selected.value = next;
  }

  toggleAll(): void {
    if (this.isAllSelected) {
      this.state.selected.value = new Set();
    } else {
      this.state.selected.value = new Set(this.data.map((row) => this.keyOf(row)));
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

  async init(): Promise<boolean> {
    if (this.state.initialized.value) return true;
    this.state.initialized.value = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading.value = true;
    try {
      const result = await this.fetchAction.fetch(
        {
          page: this.page,
          pageSize: this.pageSize,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
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
