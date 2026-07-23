<script lang="ts">
import type {
  TableBindings,
  TableContext,
  TableProps,
  TableSlots,
} from "#foundation/types/common/table";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TableProps>();

defineSlots<TableSlots>();

const el = useTemplateRef<HTMLTableElement>("el");

const bindings = computed<TableBindings>(() =>
  useBindings<"table">(modifiers, tokens, aria),
);

const ctx = computed<TableContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <table ref="el" class="f-table" v-bind="bindings">
    <slot :ctx="ctx" />
  </table>
</template>
