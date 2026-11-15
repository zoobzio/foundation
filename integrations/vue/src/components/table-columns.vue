<script lang="ts">
import type {
  TableColumnsContext,
  TableColumnsEmits,
  TableColumnsPassthrough,
  TableColumnsProps,
  TableColumnsSlots,
} from "../types/components/table-columns";
import type { RowData } from "@zoobzio/table";
import type { ComponentPublicInstance } from "vue";

import Command from "./command.vue";
import Fab from "./fab.vue";
import Popover from "./popover.vue";

import Primitive from "./primitive.vue";

import { useTemplateRef } from "vue";
import { useModel } from "../composables/model";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { columnOption } from "../utils/table";
import {
  TABLE_COLUMNS_GROUP_LABEL,
  TABLE_COLUMNS_LABEL,
  TABLE_COLUMNS_PLACEHOLDER,
} from "../constants/table";
</script>

<script setup lang="ts" generic="T extends RowData">
const { service, open = undefined, pt } = defineProps<TableColumnsProps<T>>();

const emit = defineEmits<TableColumnsEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TableColumnsPassthrough>(() => {
  const columns = service.table.getAllLeafColumns();
  const options = columns.map(columnOption);
  const visible = new Set(
    columns.filter((c) => c.getIsVisible()).map((c) => c.id),
  );
  return {
    pt,
    recipes: {
      popover: {
        open: $open.value,
        align: "end",
        "onUpdate:open": (v) => {
          $open.value = v;
        },
      },
      trigger: { as: Fab, label: TABLE_COLUMNS_LABEL },
      command: {
        as: Command,
        groups: [{ key: "columns", label: TABLE_COLUMNS_GROUP_LABEL, options }],
        modelValue: options.filter((o) => visible.has(o.value)),
        multiple: true,
        placeholder: TABLE_COLUMNS_PLACEHOLDER,
        "onUpdate:modelValue": (v) => {
          const wanted = new Set((v ?? []).map((o) => o.value));
          service.table.setColumnVisibility(
            Object.fromEntries(
              columns.map((c) => [c.id, wanted.has(c.id) || !c.getCanHide()]),
            ),
          );
        },
      },
    },
  };
});

const ctx = useContext<TableColumnsContext<T>>("table-columns", () => ({
  table: service,
  open: $open,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TableColumnsSlots<T>>();
</script>

<template>
  <Popover ref="el" v-bind="settings.popover">
    <template #trigger>
      <slot name="columns" v-bind="ctx">
        <Primitive v-bind="settings.trigger" />
      </slot>
    </template>
    <template #content>
      <Primitive v-bind="settings.command" />
    </template>
  </Popover>
</template>
