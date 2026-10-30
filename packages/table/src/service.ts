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
} from "./types";
import type { Service as Query } from "@zoobzio/query";
import type { Emitter } from "@zoobzio/kit";

import { entries } from "objectively";
import { QueryService } from "@zoobzio/query";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import {
  TABLE_DEFAULT_CURRENCY,
  TABLE_DEFAULT_LOCALE,
  TABLE_DEFAULT_TIME_ZONE,
  TABLE_STATE_FIELDS,
} from "./constants";
import { fields } from "./util";

/**
 * The headless table machine. Owns paging, sort, selection, column order,
 * and the query over its columns; delegates data loading to `wiring.fetch`.
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
  readonly query: Query;

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();

  private readonly columnMap: Map<string, DataTableColumn<T>>;
  private readonly definitionIndex: Map<string, number>;
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
      key,
      action: (row: T) => this.runAction(key, row),
    }));
    this.bulkActions = entries(config.bulkActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        key,
        action: (selected: Set<string>) =>
          wiring.bulkActions?.[key]?.(selected),
      }),
    );
    this.pinnedColumns = config.pinnedColumns ?? [];

    this.columnMap = new Map(config.columns.map((c) => [String(c.key), c]));
    this.definitionIndex = new Map(
      config.columns.map((c, i) => [String(c.key), i]),
    );
    this.pinnedSet = new Set(this.pinnedColumns.map(String));
    this.defaultColumnKeys = (
      config.defaultColumnOrder ?? config.columns.map((c) => c.key)
    ).map(String);

    this.query = new QueryService(
      `${id}-query`,
      {
        fields: fields(this.filterableColumns),
        ...(config.textLabel && { textLabel: config.textLabel }),
      },
      this.state,
    );
    this.query.on("changed", () => this.refilter());
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
  get locale(): string {
    return this.config.locale ?? TABLE_DEFAULT_LOCALE;
  }
  get currency(): string {
    return this.config.currency ?? TABLE_DEFAULT_CURRENCY;
  }
  get timeZone(): string {
    return this.config.timeZone ?? TABLE_DEFAULT_TIME_ZONE;
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
      (this.hasActions ? 1 : 0) +
      (this.isSelectable ? 1 : 0)
    );
  }

  get hasSelection(): boolean {
    return this.selected.size > 0;
  }

  get isSelectable(): boolean {
    return this.bulkActions.length > 0;
  }

  get hasActions(): boolean {
    return this.actions.length > 0;
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
      this.state.columnOrder = this.insertAtDefinition(this.columnOrder, k);
    }
  }

  setVisibleColumns(keys: Iterable<string>): void {
    const wanted = new Set(keys);
    for (const k of this.pinnedSet) wanted.add(k);
    let order = this.columnOrder.filter((k) => wanted.has(k));
    for (const k of wanted) {
      if (!this.columnMap.has(k) || order.includes(k)) continue;
      order = this.insertAtDefinition(order, k);
    }
    this.state.columnOrder = order;
  }

  moveColumn(key: string, toKey: string): void {
    if (key === toKey) return;
    const order = [...this.columnOrder];
    const from = order.indexOf(key);
    const to = order.indexOf(toKey);
    if (from === -1 || to === -1) return;
    order.splice(from, 1);
    order.splice(to, 0, key);
    this.state.columnOrder = order;
  }

  reorderColumns(order: string[]): void {
    this.state.columnOrder = order;
  }

  private insertAtDefinition(order: string[], key: string): string[] {
    const index = this.definitionIndex.get(key) ?? Infinity;
    const at = order.findIndex(
      (k) => (this.definitionIndex.get(k) ?? Infinity) > index,
    );
    const next = [...order];
    next.splice(at === -1 ? next.length : at, 0, key);
    return next;
  }

  // --- actions ---------------------------------------------------------

  runAction(key: string, row: T): void {
    this.wiring.actions?.[key]?.(row);
  }

  runBulkAction(key: string): void {
    this.wiring.bulkActions?.[key]?.(this.selected);
  }

  resetColumns(): void {
    this.state.columnOrder = this.defaultColumnKeys;
  }

  // --- search ----------------------------------------------------------

  private refilter(): void {
    this.state.page = 1;
    this.fetch();
    this.emitter.emit("filtered", {
      id: this.id,
      query: this.query.text,
      filters: this.query.filters,
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
          query: this.query.text,
          filters: this.query.filters,
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
