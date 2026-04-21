<script lang="ts">
import type { DataTableProps } from "../types/data-table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt, recipes } = defineProps<DataTableProps<T, K>>();

useLazyAsyncData("init-table", table.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const {
  keywords: keywordsRecipe,
  facets: facetsRecipe,
  dateFilters: dateFiltersRecipe,
  pagination: paginationRecipe,
  selectAll: selectAllRecipe,
} = recipes ?? {};

const isSelectableRow = computed(() => table.selected);
const colSpan = computed(
  () => table.colSpan.value + (isSelectableRow.value ? 1 : 0),
);

const ctx = computed(() => ({ table }));
</script>

<template>
  <Group ref="el" v-bind="pt?.root" class="f-data-table">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="pt?.toolbar" class="f-data-table-toolbar">
        <Keywords
          v-if="keywordsRecipe"
          v-bind="keywordsRecipe.props"
          v-on="keywordsRecipe.handlers"
        />
        <Facets
          v-if="facetsRecipe"
          v-bind="facetsRecipe.props"
          v-on="facetsRecipe.handlers"
        />
        <DateFilters
          v-if="dateFiltersRecipe"
          v-bind="dateFiltersRecipe.props"
          v-on="dateFiltersRecipe.handlers"
        />
      </Group>
    </slot>

    <Scroller>
      <Table v-bind="pt?.table">
        <Thead v-bind="pt?.thead">
          <Tr>
            <Th v-if="isSelectableRow" class="f-data-table-select">
              <Checkbox
                v-if="selectAllRecipe"
                v-bind="selectAllRecipe.props"
                v-on="selectAllRecipe.handlers"
              />
            </Th>
            <Th
              v-for="col in table.columns"
              :key="String(col.key)"
              :class="{
                'f-data-table-sortable': col.sortable,
                'f-data-table-sorted': table.isSorted(col),
              }"
            >
              <slot name="header" v-bind="{ ...ctx, column: col }">
                <Button
                  v-if="col.sortable"
                  type="button"
                  class="f-data-table-header-btn"
                  @click="table.sortBy(table.sortFieldFor(col))"
                >
                  {{ col.label }}
                  <Icon
                    v-if="table.isSorted(col)"
                    :alias="table.getSortIcon()"
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
          <Tr v-if="!table.data.value.length">
            <Td v-bind="pt?.empty" :colspan="colSpan">
              <slot name="empty" v-bind="ctx">No data</slot>
            </Td>
          </Tr>
          <template v-else>
            <Tr v-for="(row, rowIndex) in table.data.value" :key="rowIndex">
              <Td v-if="isSelectableRow" class="f-data-table-select">
                <Checkbox
                  :model-value="table.isRowSelected(row)"
                  @update:model-value="table.toggleRow(row[table.rowKey] as K)"
                />
              </Td>
              <Td v-for="col in table.columns" :key="String(col.key)">
                <slot
                  name="cell"
                  v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
                >
                  {{ row[col.key] }}
                </slot>
              </Td>
            </Tr>
          </template>
        </Tbody>
      </Table>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination
        v-if="paginationRecipe"
        v-bind="paginationRecipe.props"
        v-on="paginationRecipe.handlers"
      />
    </slot>
  </Group>
</template>
