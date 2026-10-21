<script lang="ts">
import type {
  TableContext,
  TableEmits,
  TablePassthrough,
  TableProps,
  TableSlots,
} from "../types/components/table";

import TableBody from "./table-body.vue";
import TableBulkActions from "./table-bulk-actions.vue";
import TableColumns from "./table-columns.vue";
import TableHead from "./table-head.vue";
import Autocomplete from "./autocomplete.vue";
import Fab from "./fab.vue";
import Pagination from "./pagination.vue";
import Scroller from "./scroller.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  TABLE_EVENTS,
  TABLE_REFRESH_LABEL,
  TABLE_SEARCH_PLACEHOLDER,
} from "../constants/table";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<TableProps<T>>();

const emit = defineEmits<TableEmits<T>>();

useServiceEmits(service, TABLE_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");

const { page, pageSize, pageCount, total, hasSelection } = useRefs(service);

const settings = usePassthrough<TablePassthrough>(() => ({
  pt,
  recipes: {
    search: { service: service.query, placeholder: TABLE_SEARCH_PLACEHOLDER },
    scroller: {},
    refresh: { label: TABLE_REFRESH_LABEL, onClick: () => service.fetch() },
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

const ctx = useContext<TableContext<T>>("table", () => ({
  table: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<TableSlots<T>>();

const { THead, TBody } = useForward({
  THead: {
    component: TableHead,
    props: () => ({ service, pt: pt?.head }),
    slots,
  },
  TBody: {
    component: TableBody,
    props: () => ({ service, pt: pt?.body }),
    slots,
  },
});
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-table"
    :class="{ 'f-data-table-loading': service.loading }"
  >
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-table-toolbar">
        <slot v-if="service.searchable" name="search" v-bind="ctx">
          <Autocomplete v-bind="settings.search" class="f-data-table-search" />
        </slot>
        <TableColumns :service="service" :pt="pt?.columns">
          <template v-if="slots.columnsIcon" #columnsIcon="slotProps">
            <slot name="columnsIcon" v-bind="slotProps" />
          </template>
        </TableColumns>
        <Fab v-bind="settings.refresh">
          <template v-if="slots.refreshIcon" #icon>
            <slot name="refreshIcon" v-bind="ctx" />
          </template>
        </Fab>
      </div>
    </slot>

    <TableBulkActions v-if="hasSelection" :service="service">
      <template v-if="slots.bulkActionIcon" #bulkActionIcon="slotProps">
        <slot name="bulkActionIcon" v-bind="slotProps" />
      </template>
    </TableBulkActions>

    <Scroller v-bind="settings.scroller">
      <table class="f-table">
        <THead />
        <TBody />
      </table>
    </Scroller>

    <slot name="pagination" v-bind="ctx">
      <Pagination v-bind="settings.pagination" />
    </slot>
  </div>
</template>
