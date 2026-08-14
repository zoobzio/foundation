<script lang="ts">
import type {
  TableContext,
  TableProps,
  TableSlots,
} from "../../types/common/table";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TableProps>();

const el = useTemplateRef<HTMLTableElement>("el");

const bindings = useBindings<"table">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TableContext>("table", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TableSlots>();
</script>

<template>
  <table ref="el" class="f-table" v-bind="bindings">
    <slot v-bind="ctx" />
  </table>
</template>
