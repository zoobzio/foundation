<script lang="ts">
import type { DataTableHeadProps } from "#foundation/types/data/table-head";
</script>

<script setup lang="ts" generic="T, K = unknown">
import { computed, ref, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import { passthrough } from "#foundation/utils/passthrough";
import Button from "#foundation/components/common/Button.vue";
import Checkbox from "#foundation/components/core/Checkbox.vue";
import Group from "#foundation/components/common/Group.vue";
import Icon from "#foundation/components/common/Icon.vue";
import Span from "#foundation/components/common/Span.vue";
import Th from "#foundation/components/common/Th.vue";
import Thead from "#foundation/components/common/Thead.vue";
import Tr from "#foundation/components/common/Tr.vue";
const { table, pt } = defineProps<DataTableHeadProps<T, K>>();

const el = useTemplateRef("el");
defineExpose({ el });

const {
  visibleColumns,
  actions,
  bulkActions,
  columnOrder,
  reorderColumns,
  selectAllState,
  sortBy,
  sortFieldFor,
  isSorted,
  getSortIcon,
  toggleAll,
} = table;

const isSelectable = computed(() => bulkActions.length > 0);
const hasActions = computed(() => actions.length > 0);

const ctx = computed(() => ({ table }));

// Column header drag reorder
const draggableKey = ref<string | null>(null);
const dragKey = ref<string | null>(null);
const dropKey = ref<string | null>(null);

const onDragHandleEnter = (key: string) => {
  draggableKey.value = key;
};

const onDragHandleLeave = (key: string) => {
  if (!dragKey.value) {
    draggableKey.value = null;
  }
};

const onHeaderDragStart = (key: string, event: DragEvent) => {
  dragKey.value = key;
  dropKey.value = null;
  event.dataTransfer!.effectAllowed = "move";
};

const onHeaderDragOver = (key: string, event: DragEvent) => {
  event.preventDefault();
  if (!dragKey.value || dragKey.value === key) return;
  dropKey.value = key;
};

const dropDirection = computed(() => {
  if (!dragKey.value || !dropKey.value) return null;
  const order = columnOrder.value;
  const fromIdx = order.indexOf(dragKey.value);
  const toIdx = order.indexOf(dropKey.value);
  if (fromIdx === -1 || toIdx === -1) return null;
  return fromIdx < toIdx ? "right" : "left";
});

const onHeaderDragLeave = () => {
  dropKey.value = null;
};

const onHeaderDrop = (key: string, event: DragEvent) => {
  event.preventDefault();
  if (!dragKey.value || dragKey.value === key) return;

  const order = [...columnOrder.value];
  const fromIdx = order.indexOf(dragKey.value);
  const toIdx = order.indexOf(key);
  if (fromIdx === -1 || toIdx === -1) return;

  order.splice(fromIdx, 1);
  order.splice(toIdx, 0, dragKey.value);
  reorderColumns(order);
};

const onHeaderDragEnd = () => {
  dragKey.value = null;
  dropKey.value = null;
  draggableKey.value = null;
};

// Passthrough
const theadPT = usePassthrough(pt?.thead, { props: {}, handlers: {} });
const theadTrPT = usePassthrough(pt?.theadTr, { props: {}, handlers: {} });
const selectAllCheckboxPT = usePassthrough(pt?.selectAllCheckbox, () => ({
  props: { modelValue: selectAllState.value },
  handlers: { "update:modelValue": () => toggleAll() },
}));
const headerWrapPT = usePassthrough(pt?.headerWrap, {
  props: {},
  handlers: {},
});
const headerLabelPT = usePassthrough(pt?.headerLabel, {
  props: {},
  handlers: {},
});
</script>

<template>
  <Thead ref="el" v-bind="theadPT.props" v-on="theadPT.handlers">
    <Tr v-bind="theadTrPT.props" v-on="theadTrPT.handlers">
      <Th
        v-if="isSelectable"
        v-bind="passthrough(pt?.th, { props: {}, handlers: {} }).props"
        class="f-data-table-select"
      >
        <Checkbox
          v-bind="selectAllCheckboxPT.props"
          v-on="selectAllCheckboxPT.handlers"
        />
      </Th>
      <Th
        v-for="col in visibleColumns"
        :key="String(col.key)"
        v-bind="passthrough(pt?.th, { props: {}, handlers: {} }).props"
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
          <Group
            v-bind="headerWrapPT.props"
            class="f-data-table-header-wrap"
            v-on="headerWrapPT.handlers"
          >
            <Button
              v-if="col.sortable"
              v-bind="
                passthrough(pt?.sortButton, { props: {}, handlers: {} })
                  .props
              "
              class="f-data-table-header-btn"
              @click="sortBy(sortFieldFor(col))"
            >
              {{ col.label }}
              <Icon
                v-if="isSorted(col)"
                v-bind="
                  passthrough(pt?.sortIcon, {
                    props: { alias: getSortIcon() },
                    handlers: {},
                  }).props
                "
                class="f-data-table-sort-icon"
              />
            </Button>
            <Span
              v-else
              v-bind="headerLabelPT.props"
              class="f-data-table-header"
              v-on="headerLabelPT.handlers"
            >
              {{ col.label }}
            </Span>
            <Icon
              v-bind="
                passthrough(pt?.dragIcon, {
                  props: { alias: 'drag' as IconAlias },
                  handlers: {},
                }).props
              "
              class="f-data-table-drag-handle"
              @mouseenter="onDragHandleEnter(String(col.key))"
              @mouseleave="onDragHandleLeave(String(col.key))"
            />
          </Group>
        </slot>
      </Th>
      <Th
        v-if="hasActions"
        v-bind="passthrough(pt?.th, { props: {}, handlers: {} }).props"
        class="f-data-table-actions"
      />
    </Tr>
  </Thead>
</template>
