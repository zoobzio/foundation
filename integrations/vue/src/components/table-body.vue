<script lang="ts">
import type {
  TableBodyContext,
  TableBodyPassthrough,
  TableBodyProps,
  TableBodySlots,
} from "../types/components/table-body";

import Checkbox from "./checkbox.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import Primitive from "./primitive.vue";

import { Primitive as RekaPrimitive } from "reka-ui";

import { useSlots, useTemplateRef } from "vue";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { cell } from "../utils/format";
import { TABLE_ACTIONS_LABEL, TABLE_EMPTY_TEXT } from "../constants/table";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<TableBodyProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const slots = useSlots();

const { data, visibleColumns, colSpan, actions, isSelectable, hasActions } =
  useRefs(service);

const settings = usePassthrough<TableBodyPassthrough<T>>(() => ({
  pt,
  recipes: {
    rowCheckbox: { as: Checkbox },
    actionsTrigger: { as: Fab, label: TABLE_ACTIONS_LABEL },
    actionsMenu: {
      as: Menu,
      groups: [{ key: "actions", items: actions.value }],
      align: "end",
    },
    link: ({ value }) => ({
      as: "a",
      href: String(value),
      target: "_blank",
      rel: "noopener",
    }),
  },
}));

const ctx = useContext<TableBodyContext<T>>("table-body", () => ({
  table: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableBodySlots<T>>();
</script>

<template>
  <tbody ref="el" class="f-tbody f-data-table-body">
    <tr v-if="!data.length" class="f-tr f-data-table-empty">
      <td class="f-td" :colspan="colSpan">
        <slot name="empty" v-bind="ctx">{{ TABLE_EMPTY_TEXT }}</slot>
      </td>
    </tr>
    <template v-else>
      <tr
        v-for="row in data"
        :key="service.keyOf(row)"
        class="f-tr"
        :class="{ 'f-data-table-selected': service.isRowSelected(row) }"
      >
        <td v-if="isSelectable" class="f-td f-data-table-select">
          <Primitive
            v-bind="settings.rowCheckbox"
            :model-value="service.isRowSelected(row)"
            @update:model-value="service.toggleRow(service.keyOf(row))"
          />
        </td>
        <td v-for="col in visibleColumns" :key="String(col.key)" class="f-td">
          <!-- 1. cell:<key> overrides one column -->
          <slot
            v-if="slots[`cell:${String(col.key)}`]"
            :name="`cell:${String(col.key)}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 2. cell:<type> overrides all columns of a type -->
          <slot
            v-else-if="col.type && slots[`cell:${col.type}`]"
            :name="`cell:${col.type}`"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          />
          <!-- 3. cell overrides all cells -->
          <slot
            v-else
            name="cell"
            v-bind="{ ...ctx, row, column: col, value: row[col.key] }"
          >
            <!-- 4. Default rendering by type -->
            <RekaPrimitive
              v-if="col.type === 'url'"
              class="f-anchor"
              v-bind="settings.link({ row, column: col, value: row[col.key] })"
            >
              {{ row[col.key] }}
            </RekaPrimitive>
            <img
              v-else-if="col.type === 'image'"
              class="f-img"
              :src="String(row[col.key])"
              :alt="col.label"
            />
            <span v-else class="f-span">
              {{
                cell(
                  row[col.key],
                  col.type,
                  service.locale,
                  service.currency,
                  service.timeZone,
                )
              }}
            </span>
          </slot>
        </td>
        <td v-if="hasActions" class="f-td f-data-table-actions">
          <Primitive
            v-bind="settings.actionsMenu"
            @select="service.runAction($event.key, row)"
          >
            <Primitive v-bind="settings.actionsTrigger">
              <template v-if="slots.actionsPrepend" #prepend>
                <slot name="actionsPrepend" v-bind="{ ...ctx, row }" />
              </template>
              <template v-if="slots.actionsAppend" #append>
                <slot name="actionsAppend" v-bind="{ ...ctx, row }" />
              </template>
            </Primitive>
            <template v-if="slots.actionPrepend" #itemPrepend="{ item }">
              <slot name="actionPrepend" v-bind="{ ...ctx, row, item }" />
            </template>
            <template v-if="slots.actionAppend" #itemAppend="{ item }">
              <slot name="actionAppend" v-bind="{ ...ctx, row, item }" />
            </template>
          </Primitive>
        </td>
      </tr>
    </template>
  </tbody>
</template>
