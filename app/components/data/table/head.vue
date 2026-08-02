<script lang="ts">
import type {
  TableHeadContext,
  TableHeadPassthrough,
  TableHeadProps,
  TableHeadSlots,
} from "#foundation/types/data/table/head";
import type { ComponentPublicInstance } from "vue";

import Button from "#foundation/components/common/button.vue";
import Checkbox from "#foundation/components/core/checkbox.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
import Span from "#foundation/components/common/span.vue";
import Th from "#foundation/components/common/th.vue";
import Thead from "#foundation/components/common/thead.vue";
import Tr from "#foundation/components/common/tr.vue";

import { computed, useTemplateRef } from "#imports";
import { useTableHead } from "#foundation/composables/table";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { TABLE_DRAG_ICON } from "#foundation/constants/table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<TableHeadProps<T, K>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const {
  visibleColumns,
  actions,
  bulkActions,
  selectAllState,
  sortBy,
  sortFieldFor,
  isSorted,
  getSortIcon,
  toggleAll,
} = table;

const isSelectable = computed(() => bulkActions.length > 0);
const hasActions = computed(() => actions.length > 0);

const {
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
} = useTableHead(table);

const settings = usePassthrough<TableHeadPassthrough>(() => ({
  pt,
  recipes: {
    thead: {},
    theadTr: {},
    th: {},
    headerWrap: {},
    headerLabel: {},
    sortButton: {},
    sortIcon: {},
    dragIcon: { alias: TABLE_DRAG_ICON },
    selectAllCheckbox: {
      modelValue: selectAllState.value,
      "onUpdate:modelValue": () => toggleAll(),
    },
  },
}));

const ctx = useContext<TableHeadContext<T, K>>("data-table-head", () => ({
  table,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableHeadSlots<T, K>>();
</script>

<template>
  <Thead ref="el" v-bind="settings.thead">
    <Tr v-bind="settings.theadTr">
      <Th v-if="isSelectable" v-bind="settings.th" class="f-data-table-select">
        <Checkbox v-bind="settings.selectAllCheckbox" />
      </Th>
      <Th
        v-for="col in visibleColumns"
        :key="String(col.key)"
        v-bind="settings.th"
        :draggable="draggableKey === String(col.key)"
        :class="{
          'f-data-table-sortable': col.sortable,
          'f-data-table-sorted': isSorted(col),
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
          <Group v-bind="settings.headerWrap" class="f-data-table-header-wrap">
            <Button
              v-if="col.sortable"
              v-bind="settings.sortButton"
              class="f-data-table-header-btn"
              @click="sortBy(sortFieldFor(col))"
            >
              {{ col.label }}
              <Icon
                v-if="isSorted(col)"
                v-bind="settings.sortIcon"
                :alias="getSortIcon()"
                class="f-data-table-sort-icon"
              />
            </Button>
            <Span
              v-else
              v-bind="settings.headerLabel"
              class="f-data-table-header"
            >
              {{ col.label }}
            </Span>
            <Icon
              v-bind="settings.dragIcon"
              class="f-data-table-drag-handle"
              @mouseenter="onDragHandleEnter(String(col.key))"
              @mouseleave="onDragHandleLeave"
            />
          </Group>
        </slot>
      </Th>
      <Th v-if="hasActions" v-bind="settings.th" class="f-data-table-actions" />
    </Tr>
  </Thead>
</template>
