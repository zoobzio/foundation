<script lang="ts">
import type { DataTableProps } from "#foundation/types/data/table-widget";
</script>

<script setup lang="ts" generic="T, K = unknown">
import { computed, useLazyAsyncData, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import DataTableBody from "#foundation/components/data/table/Body.vue";
import DataTableBulkActions from "#foundation/components/data/table/BulkActions.vue";
import DataTableColumns from "#foundation/components/data/table/Columns.vue";
import DataTableFilters from "#foundation/components/data/table/Filters.vue";
import DataTableHead from "#foundation/components/data/table/Head.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Group from "#foundation/components/common/Group.vue";
import Pagination from "#foundation/components/core/Pagination.vue";
import Scroller from "#foundation/components/core/Scroller.vue";
import Table from "#foundation/components/common/Table.vue";
const { table, pt } = defineProps<DataTableProps<T, K>>();

useLazyAsyncData("init-table", table.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const { selected } = table;

const hasSelection = computed(() => selected.value.size > 0);

const ctx = computed(() => ({ table }));

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const toolbarPT = usePassthrough(pt?.toolbar, { props: {}, handlers: {} });
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
        <DataTableColumns :table="table" :pt="pt?.columns" />
        <Fab icon="refresh" @click="table.fetch()" />
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
            <template
              v-for="(_, name) in $slots"
              :key="name"
              #[name]="slotProps"
            >
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
