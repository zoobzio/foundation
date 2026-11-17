<script lang="ts">
import type {
  TableHeadContext,
  TableHeadPassthrough,
  TableHeadProps,
  TableHeadSlots,
} from "../types/components/table-head";
import type { TablePinItem } from "../types/components/table-head";
import type { RowData, TableColumn } from "@zoobzio/table";

import Checkbox from "./checkbox.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import Primitive from "./primitive.vue";

import { useSlots, useTemplateRef } from "vue";
import { useDrag } from "../composables/drag";
import { useResize } from "../composables/resize";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { TABLE_PIN_LABEL, TABLE_RESIZE_LABEL } from "../constants/table";
import {
  columnLabel,
  columnWidth,
  isSelectable,
  layoutColumns,
  moveColumn,
  pinClass,
  pinItems,
  pinStyle,
  sameRegion,
  selectAllState,
} from "../utils/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, pt } = defineProps<TableHeadProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const slots = useSlots();

const table = service.table;

const drag = useDrag(
  () => layoutColumns(table).map((column) => column.id),
  (key, toKey) => moveColumn(table, key, toKey),
  { handle: true },
);

// A drag moves a column within its region, so a column of another region
// shows no place to drop.
const dropSide = (key: string) => {
  const dragged = drag.dragKey.value;
  return dragged && sameRegion(table, dragged, key)
    ? drag.dropSideFor(key)
    : null;
};

const pin = (column: TableColumn<T>, item: TablePinItem) =>
  column.pin(item.key === "none" ? false : item.key);

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
    pinMenu: (column) => ({
      as: Menu,
      groups: [{ key: "pin", items: pinItems(column) }],
      align: "end",
    }),
    pinTrigger: (column) => ({
      as: Fab,
      label: `${TABLE_PIN_LABEL} ${columnLabel(column)}`,
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
      <th
        v-if="isSelectable(table)"
        class="f-th f-data-table-select"
        :class="{
          'f-data-table-pinned f-data-table-pinned-start':
            table.getIsSomeColumnsPinned('start'),
        }"
      >
        <Primitive v-bind="settings.selectAllCheckbox" />
      </th>
      <th
        v-for="{ column: col } in group.headers"
        :key="col.id"
        class="f-th"
        v-bind="service.can('reorder') ? drag.itemAttrs(col.id) : {}"
        :aria-sort="sortOf(col)"
        :style="pinStyle(col)"
        :class="{
          ...pinClass(col),
          'f-data-table-sortable': col.getCanSort(),
          'f-data-table-sorted': col.getIsSorted(),
          'f-data-table-dragging': drag.isDragging(col.id),
          'f-data-table-resizing': resize.isResizing(col.id),
          'f-data-table-drop-left': dropSide(col.id) === 'before',
          'f-data-table-drop-right': dropSide(col.id) === 'after',
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
            <Primitive
              v-if="col.getCanPin()"
              v-bind="settings.pinMenu(col)"
              @select="pin(col, $event)"
            >
              <slot name="pin" v-bind="{ ...ctx, column: col }">
                <Primitive
                  v-bind="settings.pinTrigger(col)"
                  class="f-data-table-pin"
                />
              </slot>
              <template v-if="slots.pinPrepend" #itemPrepend="{ item }">
                <slot
                  name="pinPrepend"
                  v-bind="{ ...ctx, column: col, item }"
                />
              </template>
              <template v-if="slots.pinAppend" #itemAppend="{ item }">
                <slot name="pinAppend" v-bind="{ ...ctx, column: col, item }" />
              </template>
            </Primitive>
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
      <th
        v-if="service.actions.length"
        class="f-th f-data-table-actions f-data-table-pinned f-data-table-pinned-end"
        :class="{
          'f-data-table-pinned-edge': !table.getIsSomeColumnsPinned('end'),
        }"
      />
    </tr>
  </thead>
</template>
