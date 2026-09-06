import type { NuxtApp } from "#app";
import type {
  Actions,
  BrowserCrumb,
  BrowserFolder,
  Config,
  Service,
  State,
} from "../types/data/browser";
import type { DataTableColumn } from "../types/data/table";
import type { IconAlias } from "../types/icon";
import type { Logger } from "../types/log";

import { entries } from "objectively";
import {
  BROWSER_SORT_ASC_ICON,
  BROWSER_SORT_DESC_ICON,
} from "../constants/browser";

export class BrowserService<T> implements Service<T> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  readonly columns: DataTableColumn<T>[];
  readonly fileKey: keyof T;
  readonly actions: Service<T>["actions"];
  readonly folderActions: Service<T>["folderActions"];
  readonly bulkActions: Service<T>["bulkActions"];

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
    this.fileKey = config.fileKey;
    this.actions = entries(config.actions ?? {}).map(([key, descriptor]) => ({
      ...descriptor,
      action: (row: T) => wiring.actions?.[key]?.(row),
    }));
    this.folderActions = entries(config.folderActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        action: (folder: BrowserFolder) =>
          wiring.folderActions?.[key]?.(folder),
      }),
    );
    this.bulkActions = entries(config.bulkActions ?? {}).map(
      ([key, descriptor]) => ({
        ...descriptor,
        action: (selected: Set<string>) =>
          wiring.bulkActions?.[key]?.(selected),
      }),
    );
  }

  get folders(): BrowserFolder[] {
    return this.state.folders.value;
  }
  get files(): T[] {
    return this.state.files.value;
  }
  get loading(): boolean {
    return this.state.loading.value;
  }
  get initialized(): boolean {
    return this.state.initialized.value;
  }
  get path(): BrowserCrumb[] {
    return this.state.path.value;
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

  /** Descends into a folder: push its crumb, drop the selection, refetch. */
  open(folder: BrowserFolder): void {
    this.state.path.value = [
      ...this.path,
      { key: folder.key, label: folder.label },
    ];
    this.state.selected.value = new Set();
    this.fetch();
    this.log.debug("Browser navigated", { id: this.id, path: this.pathKeys });
    this.emit("browser:navigated", { id: this.id, path: this.pathKeys });
  }

  /**
   * Jumps to a trail position: `0` is the root, `depth` is where the
   * browser already stands (a no-op, like clicking the current crumb).
   */
  navigate(index: number): void {
    if (index < 0 || index >= this.depth) return;
    this.state.path.value = this.path.slice(0, index);
    this.state.selected.value = new Set();
    this.fetch();
    this.log.debug("Browser navigated", { id: this.id, path: this.pathKeys });
    this.emit("browser:navigated", { id: this.id, path: this.pathKeys });
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.state.sortDirection.value =
        this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField.value = field;
      this.state.sortDirection.value = "asc";
    }
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
      ? BROWSER_SORT_ASC_ICON
      : BROWSER_SORT_DESC_ICON;
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
        this.files.map((row) => this.keyOf(row)),
      );
    }
  }

  clearSelection(): void {
    this.state.selected.value = new Set();
  }

  isRowSelected(row: T): boolean {
    return this.selected.has(this.keyOf(row));
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
          path: this.pathKeys,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },
        this,
      );
      // Folders render alphabetically no matter what order the fetch
      // returns; file order is the fetch's to decide.
      this.state.folders.value = [...result.folders].sort((a, b) =>
        a.label.localeCompare(b.label),
      );
      this.state.files.value = result.files;
    } finally {
      this.state.loading.value = false;
      this.log.debug("Browser updated", {
        id: this.id,
        path: this.pathKeys,
        folders: this.folders.length,
        files: this.files.length,
      });
      this.emit("browser:updated", {
        id: this.id,
        path: this.pathKeys,
        folders: this.folders.length,
        files: this.files.length,
      });
    }
  }
}
