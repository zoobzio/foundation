<script lang="ts">
import type {
  TableHeadContext,
  TableHeadPassthrough,
  TableHeadProps,
  TableHeadSlots,
} from "../types/components/table-head";

import Checkbox from "./checkbox.vue";

import { useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { useDrag } from "../composables/drag";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<TableHeadProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const { visibleColumns, selectAllState, isSelectable, hasActions } =
  useRefs(service);

const drag = useDrag(
  () => service.columnOrder,
  (key, toKey) => service.moveColumn(key, toKey),
  { handle: true },
);

const settings = usePassthrough<TableHeadPassthrough>(() => ({
  pt,
  recipes: {
    selectAllCheckbox: {
      modelValue: selectAllState.value,
      "onUpdate:modelValue": () => service.toggleAll(),
    },
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
    <tr class="f-tr">
      <th v-if="isSelectable" class="f-th f-data-table-select">
        <Checkbox v-bind="settings.selectAllCheckbox" />
      </th>
      <th
        v-for="col in visibleColumns"
        :key="String(col.key)"
        class="f-th"
        v-bind="drag.itemAttrs(String(col.key))"
        :class="{
          'f-data-table-sortable': col.sortable,
          'f-data-table-sorted': service.isSorted(col),
          'f-data-table-dragging': drag.isDragging(String(col.key)),
          'f-data-table-drop-left':
            drag.dropSideFor(String(col.key)) === 'before',
          'f-data-table-drop-right':
            drag.dropSideFor(String(col.key)) === 'after',
        }"
      >
        <slot name="header" v-bind="{ ...ctx, column: col }">
          <div class="f-group f-data-table-header-wrap">
            <button
              v-if="col.sortable"
              type="button"
              class="f-button f-data-table-header-btn"
              @click="service.sortBy(service.sortFieldFor(col))"
            >
              <slot name="headerPrepend" v-bind="{ ...ctx, column: col }" />
              {{ col.label }}
              <slot name="headerAppend" v-bind="{ ...ctx, column: col }" />
            </button>
            <span v-else class="f-span f-data-table-header">
              <slot name="headerPrepend" v-bind="{ ...ctx, column: col }" />
              {{ col.label }}
              <slot name="headerAppend" v-bind="{ ...ctx, column: col }" />
            </span>
            <span
              class="f-span f-data-table-drag-handle"
              v-bind="drag.handleAttrs(String(col.key))"
            >
              <slot name="dragPrepend" v-bind="{ ...ctx, column: col }" />
              <slot name="dragAppend" v-bind="{ ...ctx, column: col }" />
            </span>
          </div>
        </slot>
      </th>
      <th v-if="hasActions" class="f-th f-data-table-actions" />
    </tr>
  </thead>
</template>
