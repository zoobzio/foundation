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
import Menu from "./menu.vue";
import Pagination from "./pagination.vue";
import Scroller from "./scroller.vue";

import Primitive from "./primitive.vue";

import { computed, useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { useSync } from "../composables/sync";
import {
  TABLE_EVENTS,
  TABLE_REFRESH_LABEL,
  TABLE_SEARCH_PLACEHOLDER,
} from "../constants/table";
import { isSyncCurrent, selectSync, syncGroups } from "../utils/sync";
import { columnWidth, isSelectable, layoutColumns } from "../utils/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, pt } = defineProps<TableProps<T>>();

const emit = defineEmits<TableEmits<T>>();

useServiceEmits(service, TABLE_EVENTS, emit);

// The page is kept alive while the table is on screen.
useSync(() => service.sync);

const el = useTemplateRef<HTMLDivElement>("el");

const table = service.table;

// The least the table is wide: its columns at their sizes, and the room
// the stylesheet keeps for the checkbox column and the actions column,
// which are no columns of the table's.
const minWidth = computed(
  () =>
    `calc(${table.getTotalSize()}px + var(--f-data-table-start-inset, 0px) + var(--f-data-table-end-inset, 0px))`,
);

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
    // With a sync the button is the trigger of the sync menu, which
    // refreshes at once from its first item.
    refresh: {
      as: Fab,
      label: TABLE_REFRESH_LABEL,
      ...(!service.sync && { onClick: () => service.fetch() }),
    },
    syncMenu: {
      as: Menu,
      groups: service.sync ? syncGroups(service.sync) : [],
      align: "end",
      // The item of the interval the sync is on is marked.
      pt: {
        item: (item) => ({
          "data-current": isSyncCurrent(service.sync, item) ? "" : undefined,
        }),
      },
      onSelect: (item) => {
        if (service.sync) selectSync(service.sync, item, () => service.fetch());
      },
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
      sizable: service.can("pageSize"),
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
    :class="{
      'f-data-table-loading': service.loading,
      'f-data-table-live': service.sync?.active,
      'f-data-table-syncing': service.sync?.syncing,
      'f-data-table-selectable': isSelectable(table),
      'f-data-table-actionable': service.actions.length > 0,
    }"
  >
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-table-toolbar">
        <slot v-if="service.can('search')" name="search" v-bind="ctx">
          <Primitive v-bind="settings.search" class="f-data-table-search" />
        </slot>
        <TableColumns
          v-if="service.can('hide')"
          :service="service"
          :pt="pt?.columns"
        >
          <template v-if="slots.columns" #columns="slotProps">
            <slot name="columns" v-bind="slotProps" />
          </template>
        </TableColumns>
        <template v-if="service.can('refresh')">
          <Primitive v-if="service.sync" v-bind="settings.syncMenu">
            <slot name="refresh" v-bind="ctx">
              <Primitive v-bind="settings.refresh" />
            </slot>
            <template v-if="slots.syncPrepend" #itemPrepend="{ item }">
              <slot name="syncPrepend" v-bind="{ ...ctx, item }" />
            </template>
            <template v-if="slots.syncLabel" #itemLabel="{ item }">
              <slot name="syncLabel" v-bind="{ ...ctx, item }" />
            </template>
            <template v-if="slots.syncAppend" #itemAppend="{ item }">
              <slot name="syncAppend" v-bind="{ ...ctx, item }" />
            </template>
          </Primitive>
          <slot v-else name="refresh" v-bind="ctx">
            <Primitive v-bind="settings.refresh" />
          </slot>
        </template>
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
      <table class="f-table" :style="{ minWidth }">
        <colgroup>
          <col v-if="isSelectable(table)" class="f-data-table-select" />
          <col
            v-for="col in layoutColumns(table)"
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
