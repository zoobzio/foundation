<script lang="ts">
import type {
  TableContext,
  TableEmits,
  TablePassthrough,
  TableProps,
  TableSlots,
} from "../types/components/table";
import type { RowData } from "@zoobzio/table";

import TableBody from "./table-body.vue";
import TableBulkActions from "./table-bulk-actions.vue";
import TableColumns from "./table-columns.vue";
import TableHead from "./table-head.vue";
import Autocomplete from "./autocomplete.vue";
import Fab from "./fab.vue";
import Pagination from "./pagination.vue";
import Scroller from "./scroller.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  TABLE_EVENTS,
  TABLE_REFRESH_LABEL,
  TABLE_SEARCH_PLACEHOLDER,
} from "../constants/table";
import { columnWidth, isSelectable } from "../utils/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, pt } = defineProps<TableProps<T>>();

const emit = defineEmits<TableEmits<T>>();

useServiceEmits(service, TABLE_EVENTS, emit);

const el = useTemplateRef<HTMLDivElement>("el");

const table = service.table;

const widthOf = (width: number | undefined) =>
  width === undefined ? undefined : { width: `${width}px` };

const settings = usePassthrough<TablePassthrough>(() => ({
  pt,
  recipes: {
    search: {
      as: Autocomplete,
      service: service.query,
      placeholder: TABLE_SEARCH_PLACEHOLDER,
    },
    refresh: {
      as: Fab,
      label: TABLE_REFRESH_LABEL,
      onClick: () => service.fetch(),
    },
    scroller: {
      as: Scroller,
      orientation: "horizontal",
    },
    pagination: {
      as: Pagination,
      page: table.atoms.pagination.get().pageIndex + 1,
      size: table.atoms.pagination.get().pageSize,
      count: table.getPageCount(),
      total: service.rowCount,
      "onUpdate:page": (p) => table.setPageIndex(p - 1),
      "onUpdate:size": (s) => table.setPageSize(s),
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
          <Primitive v-bind="settings.search" class="f-data-table-search" />
        </slot>
        <TableColumns :service="service" :pt="pt?.columns">
          <template v-if="slots.columns" #columns="slotProps">
            <slot name="columns" v-bind="slotProps" />
          </template>
        </TableColumns>
        <slot name="refresh" v-bind="ctx">
          <Primitive v-bind="settings.refresh" />
        </slot>
      </div>
    </slot>

    <TableBulkActions
      v-if="table.getSelectedRowIds().length"
      :service="service"
    >
      <template v-if="slots.bulkActionPrepend" #bulkActionPrepend="slotProps">
        <slot name="bulkActionPrepend" v-bind="slotProps" />
      </template>
      <template v-if="slots.bulkActionAppend" #bulkActionAppend="slotProps">
        <slot name="bulkActionAppend" v-bind="slotProps" />
      </template>
      <template v-if="slots.bulkClear" #bulkClear="slotProps">
        <slot name="bulkClear" v-bind="slotProps" />
      </template>
    </TableBulkActions>

    <Primitive v-bind="settings.scroller" class="f-data-table-scroller">
      <table class="f-table" :style="{ minWidth: `${table.getTotalSize()}px` }">
        <colgroup>
          <col v-if="isSelectable(table)" class="f-data-table-select" />
          <col
            v-for="col in table.getVisibleLeafColumns()"
            :key="col.id"
            :style="widthOf(columnWidth(col))"
          />
          <col v-if="service.actions.length" class="f-data-table-actions" />
        </colgroup>
        <THead />
        <TBody />
      </table>
    </Primitive>

    <slot name="pagination" v-bind="ctx">
      <Primitive v-bind="settings.pagination" />
    </slot>
  </div>
</template>
