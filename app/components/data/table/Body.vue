<script lang="ts">
import type { DataTableBodyProps } from "#foundation/types/data/table-body";
</script>

<script setup lang="ts" generic="T, K = unknown">
import { computed, useSlots, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import type { IconAlias } from "#foundation/types/common/iconic";
import { formatCell } from "#foundation/utils/format-cell";
import { passthrough } from "#foundation/utils/passthrough";
import Anchor from "#foundation/components/common/Anchor.vue";
import Checkbox from "#foundation/components/core/Checkbox.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Img from "#foundation/components/common/Img.vue";
import Menu from "#foundation/components/core/Menu.vue";
import Span from "#foundation/components/common/Span.vue";
import Tbody from "#foundation/components/common/Tbody.vue";
import Td from "#foundation/components/common/Td.vue";
import Tr from "#foundation/components/common/Tr.vue";
const { table, pt } = defineProps<DataTableBodyProps<T, K>>();

const el = useTemplateRef("el");
defineExpose({ el });

const slots = useSlots();

const {
  data,
  visibleColumns,
  actions,
  bulkActions,
  colSpan,
  toggleRow,
  isRowSelected,
} = table;

const getRowKey = (row: T) => row[table.rowKey] as K;

const isSelectable = computed(() => bulkActions.length > 0);
const hasActions = computed(() => actions.length > 0);

const ctx = computed(() => ({ table }));

const actionMenuGroups = computed(() => [
  {
    key: "actions",
    items: actions.map((a) => ({
      icon: a.icon,
      label: a.label,
    })),
  },
]);

const actionMap = new Map(actions.map((a) => [a.label, a]));

const onActionSelect = (row: T, item: { label: string }) => {
  actionMap.get(item.label)?.action(row);
};

// Passthrough
const tbodyPT = usePassthrough(pt?.tbody, { props: {}, handlers: {} });
const emptyPT = usePassthrough(pt?.empty, { props: {}, handlers: {} });
const actionsMenuPT = usePassthrough(pt?.actionsMenu, () => ({
  props: { groups: actionMenuGroups.value, align: "end" as const },
  handlers: {},
}));
const actionsTriggerPT = usePassthrough(pt?.actionsTrigger, {
  props: { icon: "actions" as IconAlias },
  handlers: {},
});
</script>

<template>
  <Tbody ref="el" v-bind="tbodyPT.props" v-on="tbodyPT.handlers">
    <Tr
      v-if="!data.length"
      v-bind="passthrough(pt?.tr, { props: {}, handlers: {} }).props"
    >
      <Td
        v-bind="emptyPT.props"
        :colspan="colSpan"
        v-on="emptyPT.handlers"
      >
        <slot name="empty" v-bind="ctx">No data</slot>
      </Td>
    </Tr>
    <template v-else>
      <Tr
        v-for="(row, rowIndex) in data"
        :key="rowIndex"
        v-bind="passthrough(pt?.tr, { props: {}, handlers: {} }).props"
      >
        <Td
          v-if="isSelectable"
          v-bind="passthrough(pt?.td, { props: {}, handlers: {} }).props"
          class="f-data-table-select"
        >
          <Checkbox
            v-bind="
              passthrough(pt?.rowCheckbox, {
                props: { modelValue: isRowSelected(row) },
                handlers: {},
              }).props
            "
            @update:model-value="toggleRow(getRowKey(row))"
          />
        </Td>
        <Td
          v-for="col in visibleColumns"
          :key="String(col.key)"
          v-bind="passthrough(pt?.td, { props: {}, handlers: {} }).props"
        >
          <!-- 1. cell:id — override a specific column -->
          <slot
            v-if="slots[`cell:${String(col.key)}`]"
            :name="`cell:${String(col.key)}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 2. cell:variant — override all columns of a type -->
          <slot
            v-else-if="col.type && slots[`cell:${col.type}`]"
            :name="`cell:${col.type}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 3. cell — override all cells -->
          <slot
            v-else
            name="cell"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          >
            <!-- 4. Default type-based rendering -->
            <Anchor
              v-if="col.type === 'url'"
              v-bind="
                passthrough(pt?.cellAnchor, {
                  props: { to: String(row[col.key]), external: true },
                  handlers: {},
                }).props
              "
              >{{ row[col.key] }}</Anchor
            >
            <Img
              v-else-if="col.type === 'image'"
              v-bind="
                passthrough(pt?.cellImg, {
                  props: { src: String(row[col.key]), alt: col.label },
                  handlers: {},
                }).props
              "
            />
            <Span
              v-else
              v-bind="
                passthrough(pt?.cellSpan, { props: {}, handlers: {} })
                  .props
              "
              >{{ formatCell(row[col.key], col.type) }}</Span
            >
          </slot>
        </Td>
        <Td
          v-if="hasActions"
          v-bind="passthrough(pt?.td, { props: {}, handlers: {} }).props"
          class="f-data-table-actions"
        >
          <Menu
            v-bind="actionsMenuPT.props"
            v-on="actionsMenuPT.handlers"
            @select="onActionSelect(row, $event)"
          >
            <Fab
              v-bind="actionsTriggerPT.props"
              v-on="actionsTriggerPT.handlers"
            />
          </Menu>
        </Td>
      </Tr>
    </template>
  </Tbody>
</template>
