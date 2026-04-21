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

const formatCell = (value: unknown, type?: ColumnType) => {
  if (value == null) return "";
  switch (type) {
    case "date":
      return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(String(value)));
    case "datetime":
      return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(String(value)));
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
    case "number":
      return new Intl.NumberFormat("en-US").format(Number(value));
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
};
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
                <!-- 1. cell:id — override a specific column -->
                <slot
                  v-if="$slots[`cell:${String(col.key)}`]"
                  :name="`cell:${String(col.key)}`"
                  v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
                />
                <!-- 2. cell:variant — override all columns of a type -->
                <slot
                  v-else-if="col.type && $slots[`cell:${col.type}`]"
                  :name="`cell:${col.type}`"
                  v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
                />
                <!-- 3. cell — override all cells -->
                <slot
                  v-else
                  name="cell"
                  v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
                >
                  <!-- 4. Default type-based rendering -->
                  <Anchor v-if="col.type === 'email'" :to="`mailto:${row[col.key]}`">{{ row[col.key] }}</Anchor>
                  <Anchor v-else-if="col.type === 'url'" :to="String(row[col.key])" external>{{ row[col.key] }}</Anchor>
                  <Img v-else-if="col.type === 'image'" :src="String(row[col.key])" :alt="col.label" />
                  <Span v-else>{{ formatCell(row[col.key], col.type) }}</Span>
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
