<script lang="ts">
import type { DataTableProps } from "../../../types/data-table-widget";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<DataTableProps<T, K>>();

useLazyAsyncData("init-table", table.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const { selected, selectedFacets, keywords, dateFilters } = table;

const hasSelection = computed(() => selected.value.size > 0);

const ctx = computed(() => ({ table }));

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const toolbarPT = usePassthrough(pt?.toolbar, { props: {}, handlers: {} });
const namespacedFacetGroups = computed(() =>
  table.facetGroups.value.map((g) => ({
    ...g,
    items: g.items.map((item) => ({
      ...item,
      value: `${g.key}:${item.value}`,
    })),
  })),
);
const dateFieldConfigs = computed(() =>
  table.dateColumns.value.map((c) => ({
    key: String(c.key),
    label: c.label,
  })),
);
const keywordsPT = usePassthrough(pt?.keywords, { props: {}, handlers: {} });
const facetsPT = usePassthrough(pt?.facets, () => ({
  props: { groups: namespacedFacetGroups.value },
  handlers: {},
}));
const dateFiltersPT = usePassthrough(pt?.dateFilters, () => ({
  props: {
    fields: dateFieldConfigs.value,
    addFilter: table.addDateFilter,
    removeFilter: table.removeDateFilter,
  },
  handlers: {},
}));
const scrollerPT = usePassthrough(pt?.scroller, { props: {}, handlers: {} });
const tablePT = usePassthrough(pt?.table, { props: {}, handlers: {} });
const paginationPT = usePassthrough(pt?.pagination, () => ({
  props: {
    page: table.page.value,
    pageSize: table.pageSize.value,
    pageCount: table.pageCount.value,
    total: table.total.value,
    goToPage: table.goToPage,
  },
  handlers: {
    "update:pageSize": table.setPageSize,
  },
}));
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-table"
    v-on="rootPT.handlers"
  >
    <slot name="toolbar" v-bind="ctx">
      <Group
        v-bind="toolbarPT.props"
        class="f-data-table-toolbar"
        v-on="toolbarPT.handlers"
      >
        <DataTableFilters :table="table" :pt="pt?.filters" />
        <DataTableSearch :table="table" :pt="pt?.search" />
        <Keywords
          v-model="keywords"
          v-bind="keywordsPT.props"
          v-on="keywordsPT.handlers"
        />
        <Facets
          v-model:selected="selectedFacets"
          v-bind="facetsPT.props"
          v-on="facetsPT.handlers"
        />
        <DateFilters
          v-model="dateFilters"
          v-bind="dateFiltersPT.props"
          v-on="dateFiltersPT.handlers"
        />
        <DataTableColumns :table="table" :pt="pt?.columns" />
      </Group>
    </slot>

    <DataTableBulkActions
      v-if="hasSelection"
      :table="table"
      :pt="pt?.bulkActions"
    />

    <Scroller v-bind="scrollerPT.props" v-on="scrollerPT.handlers">
      <template #content>
      <Table v-bind="tablePT.props" v-on="tablePT.handlers">
        <DataTableHead :table="table" :pt="pt?.head">
          <template #header="headerProps">
            <slot name="header" v-bind="headerProps" />
          </template>
        </DataTableHead>
        <DataTableBody :table="table" :pt="pt?.body">
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </DataTableBody>
      </Table>
      </template>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination v-bind="paginationPT.props" v-on="paginationPT.handlers" />
    </slot>
  </Group>
</template>
