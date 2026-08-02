import type { Table, Config, Actions } from "#foundation/types/data/table";

import { accessTable } from "#foundation/stores/table";
import { computed, useNuxtApp } from "#imports";
import { TableService } from "#foundation/services/table";

export const createTable = <T, K = unknown>(
  id: string,
  config: Config<T, K>,
  actions: Actions<T, K>,
) => {
  return (): Table<T, K> => {
    const nuxt = useNuxtApp();
    const state = accessTable(id, config);
    const service = new TableService(nuxt, id, config, state, actions);
    return {
      id,
      config,

      data: computed(() => service.data),
      loading: computed(() => service.loading),
      initialized: computed(() => service.initialized),

      columns: service.columns,
      rowKey: service.rowKey,
      actions: service.actions,
      bulkActions: service.bulkActions,
      pinnedColumns: service.pinnedColumns,

      page: computed(() => service.page),
      pageSize: computed(() => service.pageSize),
      pageCount: computed(() => service.pageCount),
      total: computed(() => service.total),
      sortField: computed(() => service.sortField),
      sortDirection: computed(() => service.sortDirection),

      selected: computed(() => service.selected),
      keyOf: (row) => service.keyOf(row),
      isAllSelected: computed(() => service.isAllSelected),
      isIndeterminate: computed(() => service.isIndeterminate),
      selectAllState: computed(() => service.selectAllState),

      columnOrder: computed(() => service.columnOrder),
      visibleColumns: computed(() => service.visibleColumns),
      colSpan: computed(() => service.colSpan),

      goToPage: (page: number) => service.goToPage(page),
      setPageSize: (size: number) => service.setPageSize(size),
      sortBy: (field: string) => service.sortBy(field),
      sortFieldFor: (col) => service.sortFieldFor(col),
      isSorted: (col) => service.isSorted(col),
      getSortIcon: () => service.getSortIcon(),
      toggleRow: (key: K) => service.toggleRow(key),
      toggleAll: () => service.toggleAll(),
      clearSelection: () => service.clearSelection(),
      isRowSelected: (row) => service.isRowSelected(row),
      toggleColumn: (key: keyof T) => service.toggleColumn(key),
      reorderColumns: (order: string[]) => service.reorderColumns(order),
      resetColumns: () => service.resetColumns(),
      isColumnPinned: (key: keyof T) => service.isColumnPinned(key),
      isColumnVisible: (key: keyof T) => service.isColumnVisible(key),
      init: () => service.init(),
      fetch: () => service.fetch(),
    };
  };
};
