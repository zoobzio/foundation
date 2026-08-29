<script lang="ts">
import type {
  TableHeadContext,
  TableHeadPassthrough,
  TableHeadProps,
  TableHeadSlots,
} from "../../../types/data/table/head";

import Checkbox from "../../core/checkbox.vue";

import { useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { TABLE_DRAG_ICON } from "../../../constants/table";
</script>

<script setup lang="ts" generic="T">
const { table, pt } = defineProps<TableHeadProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const {
  visibleColumns,
  selectAllState,
  isSelectable,
  hasActions,
  draggableKey,
  dragKey,
  dropKey,
  dropDirection,
  onDragHandleEnter,
  onDragHandleLeave,
  onHeaderDragStart,
  onHeaderDragOver,
  onHeaderDragLeave,
  onHeaderDrop,
  onHeaderDragEnd,
} = useTableView(table);

const settings = usePassthrough<TableHeadPassthrough>(() => ({
  pt,
  recipes: {
    selectAllCheckbox: {
      modelValue: selectAllState.value,
      "onUpdate:modelValue": () => table.toggleAll(),
    },
  },
}));

const ctx = useContext<TableHeadContext<T>>("data-table-head", () => ({
  table,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableHeadSlots<T>>();
</script>

<template>
  <thead ref="el" class="f-thead">
    <tr class="f-tr">
      <th v-if="isSelectable" class="f-th f-data-table-select">
        <Checkbox v-bind="settings.selectAllCheckbox" />
      </th>
      <th
        v-for="col in visibleColumns"
        :key="String(col.key)"
        class="f-th"
        :draggable="draggableKey === String(col.key)"
        :class="{
          'f-data-table-sortable': col.sortable,
          'f-data-table-sorted': table.isSorted(col),
          'f-data-table-dragging': dragKey === String(col.key),
          'f-data-table-drop-left':
            dropKey === String(col.key) && dropDirection === 'left',
          'f-data-table-drop-right':
            dropKey === String(col.key) && dropDirection === 'right',
        }"
        @dragstart="onHeaderDragStart(String(col.key), $event)"
        @dragover="onHeaderDragOver(String(col.key), $event)"
        @dragleave="onHeaderDragLeave"
        @drop="onHeaderDrop(String(col.key), $event)"
        @dragend="onHeaderDragEnd"
      >
        <slot name="header" v-bind="{ ...ctx, column: col }">
          <div class="f-group f-data-table-header-wrap">
            <button
              v-if="col.sortable"
              type="button"
              class="f-button f-data-table-header-btn"
              @click="table.sortBy(table.sortFieldFor(col))"
            >
              {{ col.label }}
              <Icon
                v-if="table.isSorted(col)"
                class="f-icon f-data-table-sort-icon"
                fill="currentColor"
                :name="table.getSortIcon()"
              />
            </button>
            <span v-else class="f-span f-data-table-header">
              {{ col.label }}
            </span>
            <Icon
              class="f-icon f-data-table-drag-handle"
              fill="currentColor"
              :name="TABLE_DRAG_ICON"
              @mouseenter="onDragHandleEnter(String(col.key))"
              @mouseleave="onDragHandleLeave"
            />
          </div>
        </slot>
      </th>
      <th v-if="hasActions" class="f-th f-data-table-actions" />
    </tr>
  </thead>
</template>
