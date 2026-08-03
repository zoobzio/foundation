<script lang="ts">
import type {
  TableColumnsContext,
  TableColumnsPassthrough,
  TableColumnsProps,
} from "#foundation/types/data/table/columns";
import type { ComponentPublicInstance } from "vue";

import Command from "#foundation/components/core/command.vue";
import Fab from "#foundation/components/core/fab.vue";
import Popover from "#foundation/components/core/popover.vue";

import { ref, useTemplateRef } from "#imports";
import { useTableColumns } from "#foundation/composables/table";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import {
  TABLE_COLUMNS_ICON,
  TABLE_COLUMNS_PLACEHOLDER,
} from "#foundation/constants/table";
</script>

<script setup lang="ts" generic="T, K = unknown">
const { table, pt } = defineProps<TableColumnsProps<T, K>>();

const el = useTemplateRef<ComponentPublicInstance>("el");
const open = ref(false);

const { groups, selectedOptions, onUpdate } = useTableColumns(table);

const settings = usePassthrough<TableColumnsPassthrough>(() => ({
  pt,
  recipes: {
    popover: {
      open: open.value,
      align: "end",
      "onUpdate:open": (v) => {
        open.value = v;
      },
    },
    trigger: { icon: TABLE_COLUMNS_ICON },
    command: {
      groups: groups.value,
      modelValue: selectedOptions.value,
      multiple: true,
      placeholder: TABLE_COLUMNS_PLACEHOLDER,
      "onUpdate:modelValue": onUpdate,
    },
  },
}));

const ctx = useContext<TableColumnsContext<T, K>>(
  "data-table-columns",
  () => ({ table, el: el.value, settings: settings.value }),
);

defineExpose({ ctx });
</script>

<template>
  <Popover ref="el" v-bind="settings.popover">
    <template #trigger>
      <Fab v-bind="settings.trigger" />
    </template>
    <template #content>
      <Command v-bind="settings.command" />
    </template>
  </Popover>
</template>
