<script lang="ts">
import type {
  TableHeadContext,
  TableHeadPassthrough,
  TableHeadProps,
  TableHeadSlots,
} from "../types/components/table-head";
import type { RowData, TableColumn } from "@zoobzio/table";

import Checkbox from "./checkbox.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useDrag } from "../composables/drag";
import { useResize } from "../composables/resize";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { TABLE_RESIZE_LABEL } from "../constants/table";
import {
  columnLabel,
  columnWidth,
  isSelectable,
  moveColumn,
  selectAllState,
} from "../utils/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, pt } = defineProps<TableHeadProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const table = service.table;

const drag = useDrag(
  () => table.getVisibleLeafColumns().map((column) => column.id),
  (key, toKey) => moveColumn(table, key, toKey),
  { handle: true },
);

// A resize starts from the column's size, but for the last column, which
// holds no width of its own: it starts from the width it is rendered at.
const resize = useResize(
  (key) => {
    const column = table.getColumn(key);
    return column && columnWidth(column);
  },
  (key, width) =>
    table.setColumnSizing((sizing) => ({
      ...sizing,
      [key]: Math.round(width),
    })),
  (key) => table.getColumn(key)?.resetSize(),
);

const sortOf = (column: TableColumn<T>) => {
  const sorted = column.getIsSorted();
  if (!sorted) return undefined;
  return sorted === "asc" ? "ascending" : "descending";
};

const settings = usePassthrough<TableHeadPassthrough<T>>(() => ({
  pt,
  recipes: {
    selectAllCheckbox: {
      as: Checkbox,
      modelValue: selectAllState(table),
      "onUpdate:modelValue": () => table.toggleAllPageRowsSelected(),
    },
    resizer: (column) => ({
      role: "separator",
      tabindex: 0,
      "aria-orientation": "vertical",
      "aria-label": `${TABLE_RESIZE_LABEL} ${columnLabel(column)}`,
      "aria-valuemin": column.columnDef.minSize,
      "aria-valuenow": column.getSize(),
    }),
  },
}));

const ctx = useContext<TableHeadContext<T>>("table-head", () => ({
  table: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableHeadSlots<T>>();
</script>

<template>
  <thead ref="el" class="f-thead f-data-table-head">
    <tr v-for="group in table.getHeaderGroups()" :key="group.id" class="f-tr">
      <th v-if="isSelectable(table)" class="f-th f-data-table-select">
        <Primitive v-bind="settings.selectAllCheckbox" />
      </th>
      <th
        v-for="{ column: col } in group.headers"
        :key="col.id"
        class="f-th"
        v-bind="service.can('reorder') ? drag.itemAttrs(col.id) : {}"
        :aria-sort="sortOf(col)"
        :class="{
          'f-data-table-sortable': col.getCanSort(),
          'f-data-table-sorted': col.getIsSorted(),
          'f-data-table-dragging': drag.isDragging(col.id),
          'f-data-table-resizing': resize.isResizing(col.id),
          'f-data-table-drop-left': drag.dropSideFor(col.id) === 'before',
          'f-data-table-drop-right': drag.dropSideFor(col.id) === 'after',
        }"
      >
        <slot name="header" v-bind="{ ...ctx, column: col }">
          <div class="f-group f-data-table-header-wrap">
            <button
              v-if="col.getCanSort()"
              type="button"
              class="f-button f-data-table-header-btn"
              @click="col.getToggleSortingHandler()?.($event)"
            >
              <slot name="headerPrepend" v-bind="{ ...ctx, column: col }" />
              {{ columnLabel(col) }}
              <slot name="headerAppend" v-bind="{ ...ctx, column: col }" />
            </button>
            <span v-else class="f-span f-data-table-header">
              <slot name="headerPrepend" v-bind="{ ...ctx, column: col }" />
              {{ columnLabel(col) }}
              <slot name="headerAppend" v-bind="{ ...ctx, column: col }" />
            </span>
            <span
              v-if="service.can('reorder')"
              class="f-span f-data-table-drag-handle"
              v-bind="drag.handleAttrs(col.id)"
            >
              <slot name="dragPrepend" v-bind="{ ...ctx, column: col }" />
              <slot name="dragAppend" v-bind="{ ...ctx, column: col }" />
            </span>
          </div>
        </slot>
        <span
          v-if="col.getCanResize()"
          class="f-span f-data-table-resizer"
          v-bind="{
            ...settings.resizer(col),
            ...resize.handleAttrs(col.id),
          }"
        />
      </th>
      <th v-if="service.actions.length" class="f-th f-data-table-actions" />
    </tr>
  </thead>
</template>
