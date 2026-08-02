<script lang="ts">
import type {
  TableWidgetContext,
  TableWidgetEmits,
  TableWidgetPassthrough,
  TableWidgetProps,
  TableWidgetSlots,
} from "#foundation/types/data/table/widget";
import type { Events } from "#foundation/types/data/table";
import type { ComponentPublicInstance } from "vue";

import Body from "#foundation/components/data/table/body.vue";
import BulkActions from "#foundation/components/data/table/bulk-actions.vue";
import Columns from "#foundation/components/data/table/columns.vue";
import Head from "#foundation/components/data/table/head.vue";
import Fab from "#foundation/components/core/fab.vue";
import Group from "#foundation/components/common/group.vue";
import Pagination from "#foundation/components/core/pagination.vue";
import Scroller from "#foundation/components/core/scroller.vue";
import Table from "#foundation/components/common/table.vue";

import { computed, useTemplateRef } from "#imports";
import { useHooks } from "#foundation/composables/hook";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useLazyRequest } from "#foundation/composables/request";
import { TABLE_REFRESH_ICON } from "#foundation/constants/table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<TableWidgetProps<T, K>>();

const emit = defineEmits<TableWidgetEmits>();

useHooks<Events>(table.id, {
  "table:updated": (event) => emit("updated", event),
});

useLazyRequest(`init-table-${table.id}`, table.init);

const el = useTemplateRef<ComponentPublicInstance>("el");

const { selected } = table;
const hasSelection = computed(() => selected.value.size > 0);

const settings = usePassthrough<TableWidgetPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    toolbar: {},
    scroller: {},
    table: {},
    refresh: { icon: TABLE_REFRESH_ICON, onClick: () => table.fetch() },
    pagination: {
      page: table.page.value,
      size: table.pageSize.value,
      count: table.pageCount.value,
      total: table.total.value,
      "onUpdate:page": (p) => table.goToPage(p),
      "onUpdate:size": (s) => table.setPageSize(s),
    },
  },
}));

const ctx = useContext<TableWidgetContext<T, K>>("data-table", () => ({
  table,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<TableWidgetSlots<T, K>>();

// Body-owned slots relay to the body, filtered so the body keeps its own
// defaults for any the consumer didn't supply. `empty` (body ctx) and the cell
// slots (cell ctx) forward in separate loops to stay homogeneously typed.
const emptySlots = computed(() =>
  Object.keys(slots).filter((n): n is "empty" => n === "empty"),
);
const cellSlots = computed(() =>
  Object.keys(slots).filter(
    (n): n is "cell" | `cell:${string}` =>
      n === "cell" || n.startsWith("cell:"),
  ),
);
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-table">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="settings.toolbar" class="f-data-table-toolbar">
        <Columns :table="table" :pt="pt?.columns" />
        <Fab v-bind="settings.refresh" />
      </Group>
    </slot>

    <BulkActions v-if="hasSelection" :table="table" :pt="pt?.bulkActions" />

    <Scroller v-bind="settings.scroller">
      <Table v-bind="settings.table">
        <Head :table="table" :pt="pt?.head">
          <template #header="headerProps">
            <slot name="header" v-bind="headerProps" />
          </template>
        </Head>
        <Body :table="table" :pt="pt?.body">
          <template v-for="name in emptySlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
          <template v-for="name in cellSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </Body>
      </Table>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination v-bind="settings.pagination" />
    </slot>
  </Group>
</template>
