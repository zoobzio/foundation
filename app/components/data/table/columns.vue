<script lang="ts">
import type {
  TableColumnsContext,
  TableColumnsPassthrough,
  TableColumnsProps,
  TableColumnsSlots,
} from "../../../types/data/table/columns";
import type { ComponentPublicInstance } from "vue";

import Command from "../../core/command.vue";
import Fab from "../../core/fab.vue";
import Popover from "../../core/popover.vue";

import { ref, useTemplateRef } from "#imports";
import { useTableView } from "../../../composables/table";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import {
  TABLE_COLUMNS_LABEL,
  TABLE_COLUMNS_PLACEHOLDER,
} from "../../../constants/table";
</script>

<script setup lang="ts" generic="T">
const { table, pt } = defineProps<TableColumnsProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");
const open = ref(false);

const { columnGroups, selectedColumnOptions, onColumnsUpdate } =
  useTableView(table);

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
    trigger: { label: TABLE_COLUMNS_LABEL },
    command: {
      groups: columnGroups.value,
      modelValue: selectedColumnOptions.value,
      multiple: true,
      placeholder: TABLE_COLUMNS_PLACEHOLDER,
      "onUpdate:modelValue": onColumnsUpdate,
    },
  },
}));

const ctx = useContext<TableColumnsContext<T>>(
  "data-table-columns",
  () => ({ table, el: el.value, settings: settings.value }),
);

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
