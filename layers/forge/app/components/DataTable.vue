<script lang="ts">
import type { DataTableProps } from "../types/data-table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { store, selectable = false, pt } = defineProps<DataTableProps<T, K>>();

const el = useTemplateRef("el");
defineExpose({ el });

const {
  keywordsRecipe,
  facetsRecipe,
  dateFiltersRecipe,
  paginationRecipe,
  selectAllRecipe,
} = useTable(store);

const isSelectableRow = computed(() => selectable && store.selected);
const colSpan = computed(() => store.colSpan + (isSelectableRow.value ? 1 : 0));

const ctx = computed(() => ({ store, selectable }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-data-table">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="pt?.toolbar" class="f-data-table-toolbar">
        <Keywords v-bind="keywordsRecipe.props" v-on="keywordsRecipe.handlers" />
        <Facets v-bind="facetsRecipe.props" v-on="facetsRecipe.handlers" />
        <DateFilters v-bind="dateFiltersRecipe.props" v-on="dateFiltersRecipe.handlers" />
      </Group>
    </slot>

    <Scroller>
      <Table v-bind="pt?.table">
        <Thead v-bind="pt?.thead">
          <Tr>
            <Th v-if="isSelectableRow" class="f-data-table-select">
              <Checkbox v-bind="selectAllRecipe.props" v-on="selectAllRecipe.handlers" />
            </Th>
            <Th
              v-for="col in store.columns"
              :key="String(col.key)"
              :class="{
                'f-data-table-sortable': col.sortable,
                'f-data-table-sorted': store.isSorted(col),
              }"
            >
              <slot name="header" v-bind="{ ...ctx, column: col }">
                <Button
                  v-if="col.sortable"
                  type="button"
                  class="f-data-table-header-btn"
                  @click="store.sortBy(store.sortFieldFor(col))"
                >
                  {{ col.label }}
                  <Icon
                    v-if="store.isSorted(col)"
                    :alias="store.getSortIcon()"
                    class="f-data-table-sort-icon"
                  />
                </Button>
                <Span v-else class="f-data-table-header">
                  {{ col.label }}
                </Span>
              </slot>
            </Th>
          </Tr>
        </Thead>
        <Tbody v-bind="pt?.tbody">
          <Tr v-if="!store.data.length">
            <Td v-bind="pt?.empty" :colspan="colSpan">
              <slot name="empty" v-bind="ctx">No data</slot>
            </Td>
          </Tr>
          <template v-else>
            <Tr v-for="(row, rowIndex) in store.data" :key="rowIndex">
              <Td v-if="isSelectableRow" class="f-data-table-select">
                <Checkbox
                  :model-value="store.isRowSelected(row)"
                  @update:model-value="store.toggleRow(row[store.rowKey] as K)"
                />
              </Td>
              <Td v-for="col in store.columns" :key="String(col.key)">
                <slot name="cell" v-bind="{ ...ctx, row, column: col, value: row[col.key] }">
                  {{ row[col.key] }}
                </slot>
              </Td>
            </Tr>
          </template>
        </Tbody>
      </Table>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination v-bind="paginationRecipe.props" v-on="paginationRecipe.handlers" />
    </slot>
  </Group>
</template>
