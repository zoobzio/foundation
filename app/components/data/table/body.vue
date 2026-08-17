<script lang="ts">
import type {
  TableBodyContext,
  TableBodyPassthrough,
  TableBodyProps,
  TableBodySlots,
} from "../../../types/data/table/body";
import type { ComponentPublicInstance } from "vue";

import Anchor from "../../common/anchor.vue";
import Checkbox from "../../core/checkbox.vue";
import Fab from "../../core/fab.vue";
import Img from "../../common/img.vue";
import Menu from "../../core/menu.vue";
import Span from "../../common/span.vue";
import Tbody from "../../common/tbody.vue";
import Td from "../../common/td.vue";
import Tr from "../../common/tr.vue";

import { useSlots, useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { cell } from "../../../utils/format";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<TableBodyProps<T, K>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const slots = useSlots();

const {
  data,
  visibleColumns,
  colSpan,
  isSelectable,
  hasActions,
  actionGroups,
  onActionSelect,
} = useTableView(table);

const settings = usePassthrough<TableBodyPassthrough>(() => ({
  pt,
  recipes: {
    tbody: {},
    tr: {},
    td: {},
    empty: {},
    rowCheckbox: {},
    cellAnchor: { external: true },
    cellImg: {},
    cellSpan: {},
    actionsTrigger: { icon: "actions" },
    actionsMenu: { groups: actionGroups.value, align: "end" },
  },
}));

const ctx = useContext<TableBodyContext<T, K>>("data-table-body", () => ({
  table,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableBodySlots<T, K>>();
</script>

<template>
  <Tbody ref="el" v-bind="settings.tbody">
    <Tr v-if="!data.length" v-bind="settings.tr">
      <Td v-bind="settings.empty" :colspan="colSpan">
        <slot name="empty" v-bind="ctx">No data</slot>
      </Td>
    </Tr>
    <template v-else>
      <Tr v-for="(row, rowIndex) in data" :key="rowIndex" v-bind="settings.tr">
        <Td v-if="isSelectable" v-bind="settings.td" class="f-data-table-select">
          <Checkbox
            v-bind="settings.rowCheckbox"
            :model-value="table.isRowSelected(row)"
            @update:model-value="table.toggleRow(table.keyOf(row))"
          />
        </Td>
        <Td
          v-for="col in visibleColumns"
          :key="String(col.key)"
          v-bind="settings.td"
        >
          <!-- 1. cell:<key> — override a specific column -->
          <slot
            v-if="slots[`cell:${String(col.key)}`]"
            :name="`cell:${String(col.key)}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 2. cell:<type> — override all columns of a type -->
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
              v-bind="settings.cellAnchor"
              :to="String(row[col.key])"
            >
              {{ row[col.key] }}
            </Anchor>
            <Img
              v-else-if="col.type === 'image'"
              v-bind="settings.cellImg"
              :src="String(row[col.key])"
              :alt="col.label"
            />
            <Span v-else v-bind="settings.cellSpan">
              {{ cell(row[col.key], col.type) }}
            </Span>
          </slot>
        </Td>
        <Td
          v-if="hasActions"
          v-bind="settings.td"
          class="f-data-table-actions"
        >
          <Menu
            v-bind="settings.actionsMenu"
            @select="onActionSelect(row, $event)"
          >
            <Fab v-bind="settings.actionsTrigger" />
          </Menu>
        </Td>
      </Tr>
    </template>
  </Tbody>
</template>
