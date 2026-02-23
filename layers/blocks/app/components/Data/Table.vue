<script lang="ts">
import type { TableStore, SelectableStore, DataTableColumn } from "../../types/common";

export interface DataTableProps<T, K extends keyof T = keyof T> {
  store: TableStore<T> & Partial<SelectableStore<T[K]>>;
  columns: DataTableColumn<T>[];
  selectable?: boolean;
  rowKey?: K;
}
</script>

<script setup lang="ts" generic="T extends Record<string, unknown>, K extends keyof T = keyof T">
const { store, columns, selectable = false, rowKey } = defineProps<DataTableProps<T, K>>();

const isSelectable = computed(() => selectable && rowKey && 'selected' in store);

const getSelectAllState = computed(() => {
  if (!isSelectable.value) return false;
  if (store.isIndeterminate?.value) return 'indeterminate' as const;
  return store.isAllSelected?.value ?? false;
});

const handleSelectAll = () => {
  store.toggleAll?.();
};

const isRowSelected = (row: T) => {
  if (!isSelectable.value || !rowKey) return false;
  return store.selected?.value.has(row[rowKey]) ?? false;
};

const handleRowSelect = (row: T) => {
  if (!rowKey) return;
  store.toggleRow?.(row[rowKey]);
};

const isSorted = (col: DataTableColumn<T>) => store.sortKey.value === col.key;
const getSortIcon = (col: DataTableColumn<T>) => {
  if (!isSorted(col)) return null;
  return store.sortDirection.value === "asc" ? "chevron-up" : "chevron-down";
};

const handleSort = (col: DataTableColumn<T>) => {
  if (col.sortable) {
    store.sort(col.key);
  }
};

const colSpan = computed(() => columns.length + (isSelectable.value ? 1 : 0));
</script>

<template>
  <div class="f-data-table">
    <slot name="toolbar" :store="store" />

    <Scroller>
      <Table>
        <Thead>
          <Tr>
            <Th v-if="isSelectable" class="f-data-table-select">
              <Checkbox
                :model-value="getSelectAllState"
                @update:model-value="handleSelectAll"
              />
            </Th>
            <Th
              v-for="col in columns"
              :key="String(col.key)"
              :class="{ 'f-data-table-sortable': col.sortable, 'f-data-table-sorted': isSorted(col) }"
            >
              <span class="f-data-table-header-wrap">
                <slot name="header" :column="col" :sort="() => handleSort(col)">
                  <button
                    v-if="col.sortable"
                    type="button"
                    class="f-data-table-header-btn"
                    @click="handleSort(col)"
                  >
                    {{ col.label }}
                    <Icon v-if="getSortIcon(col)" :alias="getSortIcon(col)!" class="f-data-table-sort-icon" />
                  </button>
                  <span v-else class="f-data-table-header">
                    {{ col.label }}
                  </span>
                </slot>
              </span>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr v-if="store.loading?.value">
            <Td :colspan="colSpan">
              <slot name="loading">Loading...</slot>
            </Td>
          </Tr>
          <Tr v-else-if="!store.data?.value?.length">
            <Td :colspan="colSpan">
              <slot name="empty">No data</slot>
            </Td>
          </Tr>
          <template v-else>
            <Tr v-for="(row, rowIndex) in store.data.value" :key="rowIndex">
              <Td v-if="isSelectable" class="f-data-table-select">
                <Checkbox
                  :model-value="isRowSelected(row)"
                  @update:model-value="() => handleRowSelect(row)"
                />
              </Td>
              <Td v-for="col in columns" :key="String(col.key)">
                <slot name="cell" :row="row" :column="col" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </Td>
            </Tr>
          </template>
        </Tbody>
      </Table>
    </Scroller>

    <slot name="pagination" :store="store">
      <DataPagination :store="store" />
    </slot>
  </div>
</template>
