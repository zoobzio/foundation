<script lang="ts">
import type {
  TableWidgetContext,
  TableWidgetEmits,
  TableWidgetPassthrough,
  TableWidgetProps,
  TableWidgetSlots,
} from "../../../types/data/table/widget";
import type { Events } from "../../../types/data/table";

import Body from "./body.vue";
import BulkActions from "./bulk-actions.vue";
import Columns from "./columns.vue";
import Head from "./head.vue";
import Autocomplete from "../../core/autocomplete.vue";
import Fab from "../../core/fab.vue";
import Pagination from "../../core/pagination.vue";
import Scroller from "../../core/scroller.vue";

import { computed, useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useLazyRequest } from "../../../composables/request";
import { TABLE_REFRESH_ICON } from "../../../constants/table";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<TableWidgetProps<T>>();

const emit = defineEmits<TableWidgetEmits>();

useHooks<Events>(service.id, {
  "table:updated": (event) => emit("updated", event),
  "table:filtered": (event) => emit("filtered", event),
});

const el = useTemplateRef<HTMLDivElement>("el");

const { page, pageSize, pageCount, total, hasSelection, searchRecipes } =
  useTableView(service);

const settings = usePassthrough<TableWidgetPassthrough<T>>(() => ({
  pt,
  recipes: {
    ...searchRecipes.value,
    scroller: {},
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

const ctx = useContext<TableWidgetContext<T>>("data-table", () => ({
  table: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<TableWidgetSlots<T>>();

// Child-owned slots relay to the head and body, filtered so each child
// keeps its own defaults for any the consumer didn't supply. `header`
// (head ctx), `empty` (body ctx), and the cell slots (cell ctx) forward in
// separate loops to stay homogeneously typed.
const headerSlots = computed(() =>
  Object.keys(slots).filter((n): n is "header" => n === "header"),
);
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
  <div ref="el" class="f-group f-data-table">
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-table-toolbar">
        <slot v-if="service.searchable" name="search" v-bind="ctx">
          <Autocomplete
            v-bind="settings.search"
            class="f-data-table-search"
          />
        </slot>
        <Columns :table="service" :pt="pt?.columns" />
        <Fab v-bind="settings.refresh" />
      </div>
    </slot>

    <BulkActions v-if="hasSelection" :table="service" />

    <Scroller v-bind="settings.scroller">
      <table class="f-table">
        <Head :table="service" :pt="pt?.head">
          <template v-for="name in headerSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
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
      </table>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination v-bind="settings.pagination" />
    </slot>
  </div>
</template>
