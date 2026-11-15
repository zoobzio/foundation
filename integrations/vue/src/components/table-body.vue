<script lang="ts">
import type {
  TableBodyContext,
  TableBodyPassthrough,
  TableBodyProps,
  TableBodySlots,
} from "../types/components/table-body";
import type { RowData, TableCell } from "@zoobzio/table";

import Checkbox from "./checkbox.vue";
import Fab from "./fab.vue";
import Menu from "./menu.vue";

import Primitive from "./primitive.vue";

import { Primitive as RekaPrimitive } from "reka-ui";

import { useSlots, useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { cell as format } from "../utils/format";
import { TABLE_ACTIONS_LABEL, TABLE_EMPTY_TEXT } from "../constants/table";
import { columnLabel, isSelectable } from "../utils/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, pt } = defineProps<TableBodyProps<T>>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const slots = useSlots();

const table = service.table;

/** The cells the empty state spans: every column the table renders. */
const colSpan = () =>
  table.getVisibleLeafColumns().length +
  (isSelectable(table) ? 1 : 0) +
  (service.actions.length ? 1 : 0);

/** A cell as its slots and its link take it. */
const scope = (cell: TableCell<T>) => ({
  cell,
  row: cell.row,
  column: cell.column,
  value: cell.getValue(),
});

const typeOf = (cell: TableCell<T>) => cell.column.columnDef.meta?.type;

const settings = usePassthrough<TableBodyPassthrough<T>>(() => ({
  pt,
  recipes: {
    rowCheckbox: { as: Checkbox },
    actionsTrigger: { as: Fab, label: TABLE_ACTIONS_LABEL },
    actionsMenu: {
      as: Menu,
      groups: [{ key: "actions", items: service.actions }],
      align: "end",
    },
    link: ({ row, column, value }) => {
      const link = column.columnDef.meta?.link;
      return link
        ? { as: "a", href: link(row.original) }
        : { as: "a", href: String(value), target: "_blank", rel: "noopener" };
    },
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
    <tr v-if="!table.getRowModel().rows.length" class="f-tr f-data-table-empty">
      <td class="f-td" :colspan="colSpan()">
        <slot name="empty" v-bind="ctx">{{ TABLE_EMPTY_TEXT }}</slot>
      </td>
    </tr>
    <template v-else>
      <tr
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="f-tr"
        :class="{ 'f-data-table-selected': row.getIsSelected() }"
      >
        <td v-if="isSelectable(table)" class="f-td f-data-table-select">
          <Primitive
            v-bind="settings.rowCheckbox"
            :model-value="row.getIsSelected()"
            :disabled="!row.getCanSelect()"
            @update:model-value="row.toggleSelected()"
          />
        </td>
        <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="f-td">
          <!-- 1. cell:<id> overrides one column -->
          <slot
            v-if="slots[`cell:${cell.column.id}`]"
            :name="`cell:${cell.column.id}`"
            v-bind="{ ...ctx, ...scope(cell) }"
          />
          <!-- A column with a route renders its cell through the link part -->
          <RekaPrimitive
            v-else-if="cell.column.columnDef.meta?.link"
            class="f-anchor"
            v-bind="settings.link(scope(cell))"
          >
            <slot
              v-if="typeOf(cell) && slots[`cell:${typeOf(cell)}`]"
              :name="`cell:${typeOf(cell)}`"
              v-bind="{ ...ctx, ...scope(cell) }"
            />
            <slot v-else name="cell" v-bind="{ ...ctx, ...scope(cell) }">
              <span class="f-span">
                {{
                  format(
                    cell.getValue(),
                    typeOf(cell),
                    service.locale,
                    service.currency,
                    service.timeZone,
                  )
                }}
              </span>
            </slot>
          </RekaPrimitive>
          <!-- 2. cell:<type> overrides all columns of a type -->
          <slot
            v-else-if="typeOf(cell) && slots[`cell:${typeOf(cell)}`]"
            :name="`cell:${typeOf(cell)}`"
            v-bind="{ ...ctx, ...scope(cell) }"
          />
          <!-- 3. cell overrides all cells -->
          <slot v-else name="cell" v-bind="{ ...ctx, ...scope(cell) }">
            <!-- 4. Default rendering by type -->
            <RekaPrimitive
              v-if="typeOf(cell) === 'url'"
              class="f-anchor"
              v-bind="settings.link(scope(cell))"
            >
              {{ cell.getValue() }}
            </RekaPrimitive>
            <img
              v-else-if="typeOf(cell) === 'image'"
              class="f-img"
              :src="String(cell.getValue())"
              :alt="String(columnLabel(cell.column))"
            />
            <span v-else class="f-span">
              {{
                format(
                  cell.getValue(),
                  typeOf(cell),
                  service.locale,
                  service.currency,
                  service.timeZone,
                )
              }}
            </span>
          </slot>
        </td>
        <td v-if="service.actions.length" class="f-td f-data-table-actions">
          <Primitive
            v-bind="settings.actionsMenu"
            @select="service.runAction($event.key, row.original)"
          >
            <slot name="actions" v-bind="{ ...ctx, row }">
              <Primitive v-bind="settings.actionsTrigger" />
            </slot>
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
