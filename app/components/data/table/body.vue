<script lang="ts">
import type {
  TableBodyContext,
  TableBodyPassthrough,
  TableBodyProps,
  TableBodySlots,
} from "../../../types/data/table/body";

import Checkbox from "../../core/checkbox.vue";
import Fab from "../../core/fab.vue";
import Menu from "../../core/menu.vue";

import { useSlots, useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { cell } from "../../../utils/format";
</script>

<script setup lang="ts" generic="T">
const { table, pt } = defineProps<TableBodyProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

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
    rowCheckbox: {},
    actionsTrigger: { icon: "actions" },
    actionsMenu: { groups: actionGroups.value, align: "end" },
  },
}));

const ctx = useContext<TableBodyContext<T>>("data-table-body", () => ({
  table,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableBodySlots<T>>();
</script>

<template>
  <tbody ref="el" class="f-tbody">
    <tr v-if="!data.length" class="f-tr">
      <td class="f-td" :colspan="colSpan">
        <slot name="empty" v-bind="ctx">No data</slot>
      </td>
    </tr>
    <template v-else>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="f-tr">
        <td v-if="isSelectable" class="f-td f-data-table-select">
          <Checkbox
            v-bind="settings.rowCheckbox"
            :model-value="table.isRowSelected(row)"
            @update:model-value="table.toggleRow(table.keyOf(row))"
          />
        </td>
        <td
          v-for="col in visibleColumns"
          :key="String(col.key)"
          class="f-td"
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
            <NuxtLink
              v-if="col.type === 'url'"
              class="f-anchor"
              :external="true"
              :to="String(row[col.key])"
            >
              {{ row[col.key] }}
            </NuxtLink>
            <img
              v-else-if="col.type === 'image'"
              class="f-img"
              :src="String(row[col.key])"
              :alt="col.label"
            >
            <span v-else class="f-span">
              {{ cell(row[col.key], col.type) }}
            </span>
          </slot>
        </td>
        <td
          v-if="hasActions"
          class="f-td f-data-table-actions"
        >
          <Menu
            v-bind="settings.actionsMenu"
            @select="onActionSelect(row, $event)"
          >
            <Fab v-bind="settings.actionsTrigger" />
          </Menu>
        </td>
      </tr>
    </template>
  </tbody>
</template>
