<script lang="ts">
import type { DataTableColumn, TableStore, SelectableStore } from "../../types/common";

export interface DataTableProps<T, K = unknown> {
  store: TableStore<T>;
  columns: DataTableColumn<T>[];
  selectable?: boolean;
  rowKey?: keyof T;
  selection?: SelectableStore<K>;
}
</script>

<script setup lang="ts" generic="T extends Record<string, unknown>, K = unknown">
const props = defineProps<DataTableProps<T, K>>();

const { data, loading, sortField, sortDirection, sort } = props.store;

const isSelectableRow = computed(() => props.selectable && props.rowKey && props.selection);

const getSelectAllState = computed(() => {
  if (!isSelectableRow.value || !props.selection) return false;
  if (props.selection.isIndeterminate.value) return 'indeterminate' as const;
  return props.selection.isAllSelected.value;
});

const isRowSelected = (row: T) => {
  if (!isSelectableRow.value || !props.rowKey || !props.selection) return false;
  return props.selection.selected.value.has(row[props.rowKey] as K);
};

const toggleRow = (row: T) => {
  if (props.rowKey && props.selection) {
    props.selection.toggleRow(row[props.rowKey] as K);
  }
};

const sortFieldFor = (col: DataTableColumn<T>) => col.sortKey ?? String(col.key);
const isSorted = (col: DataTableColumn<T>) => sortField.value === sortFieldFor(col);
const getSortIcon = (col: DataTableColumn<T>) => {
  if (!isSorted(col)) return null;
  return sortDirection.value === "asc" ? "chevron-up" : "chevron-down";
};

const handleSort = (col: DataTableColumn<T>) => {
  if (col.sortable) sort(sortFieldFor(col));
};

const colSpan = computed(() => props.columns.length + (isSelectableRow.value ? 1 : 0));
</script>

<template>
  <div class="f-data-table">
    <slot name="toolbar" />

    <Scroller>
      <Table>
        <Thead>
          <Tr>
            <Th v-if="isSelectableRow" class="f-data-table-select">
              <Checkbox
                :model-value="getSelectAllState"
                @update:model-value="selection!.toggleAll()"
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
          <Tr v-if="!data.length">
            <Td :colspan="colSpan">
              <slot name="empty">No data</slot>
            </Td>
          </Tr>
          <template v-else>
            <Tr v-for="(row, rowIndex) in data" :key="rowIndex">
              <Td v-if="isSelectableRow" class="f-data-table-select">
                <Checkbox
                  :model-value="isRowSelected(row)"
                  @update:model-value="toggleRow(row)"
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

    <slot name="pagination" />
  </div>
</template>
