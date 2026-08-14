<script lang="ts">
import type {
  TableWidgetContext,
  TableWidgetEmits,
  TableWidgetPassthrough,
  TableWidgetProps,
  TableWidgetSlots,
} from "../../../types/data/table/widget";
import type { Events } from "../../../types/data/table";
import type { ComponentPublicInstance } from "vue";

import Body from "./body.vue";
import BulkActions from "./bulk-actions.vue";
import Columns from "./columns.vue";
import Head from "./head.vue";
import Fab from "../../core/fab.vue";
import Group from "../../common/group.vue";
import Pagination from "../../core/pagination.vue";
import Scroller from "../../core/scroller.vue";
import Table from "../../common/table.vue";

import { computed, useTemplateRef } from "#imports";
import { useTable } from "../../../composables/table";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useLazyRequest } from "../../../composables/request";
import { TABLE_REFRESH_ICON } from "../../../constants/table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { service, pt } = defineProps<TableWidgetProps<T, K>>();

const emit = defineEmits<TableWidgetEmits>();

useHooks<Events>(service.id, {
  "table:updated": (event) => emit("updated", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { page, pageSize, pageCount, total, hasSelection } = useTable(service);

const settings = usePassthrough<TableWidgetPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    toolbar: {},
    scroller: {},
    table: {},
    refresh: { icon: TABLE_REFRESH_ICON, onClick: () => service.fetch() },
    pagination: {
      page: page.value,
      size: pageSize.value,
      count: pageCount.value,
      total: total.value,
      "onUpdate:page": (p) => service.goToPage(p),
      "onUpdate:size": (s) => service.setPageSize(s),
    },
  },
}));

const ctx = useContext<TableWidgetContext<T, K>>("data-table", () => ({
  table: service,
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

useLazyRequest(`init-table-${service.id}`, () => service.init());
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-table">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="settings.toolbar" class="f-data-table-toolbar">
        <Columns :table="service" :pt="pt?.columns" />
        <Fab v-bind="settings.refresh" />
      </Group>
    </slot>

    <BulkActions v-if="hasSelection" :table="service" :pt="pt?.bulkActions" />

    <Scroller v-bind="settings.scroller">
      <Table v-bind="settings.table">
        <Head :table="service" :pt="pt?.head">
          <template #header="headerProps">
            <slot name="header" v-bind="headerProps" />
          </template>
        </Head>
        <Body :table="service" :pt="pt?.body">
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
