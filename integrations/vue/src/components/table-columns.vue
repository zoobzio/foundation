<script lang="ts">
import type {
  TableColumnsContext,
  TableColumnsEmits,
  TableColumnsPassthrough,
  TableColumnsProps,
  TableColumnsSlots,
} from "../types/components/table-columns";
import type { ComponentPublicInstance } from "vue";

import Command from "./command.vue";
import Fab from "./fab.vue";
import Popover from "./popover.vue";

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

<script setup lang="ts" generic="T">
const { service, open = undefined, pt } = defineProps<TableColumnsProps<T>>();

const emit = defineEmits<TableColumnsEmits>();

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TableColumnsPassthrough>(() => {
  const options = service.columns.map((c) => columnOption(service, c));
  const visible = new Set(service.columnOrder);
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
      trigger: { label: TABLE_COLUMNS_LABEL },
      command: {
        groups: [{ key: "columns", label: TABLE_COLUMNS_GROUP_LABEL, options }],
        modelValue: options.filter((o) => visible.has(o.value)),
        multiple: true,
        placeholder: TABLE_COLUMNS_PLACEHOLDER,
        "onUpdate:modelValue": (v) => {
          service.setVisibleColumns((v ?? []).map((o) => o.value));
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
      <Fab v-bind="settings.trigger">
        <template v-if="$slots.columnsIcon" #icon>
          <slot name="columnsIcon" v-bind="ctx" />
        </template>
      </Fab>
    </template>
    <template #content>
      <Command v-bind="settings.command" />
    </template>
  </Popover>
</template>
