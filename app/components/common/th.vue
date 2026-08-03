<script lang="ts">
import type {
  ThContext,
  ThProps,
  ThSlots,
} from "#foundation/types/common/th";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { scope, modifiers, tokens, aria } = defineProps<ThProps>();

const el = useTemplateRef<HTMLTableCellElement>("el");

const bindings = useBindings<"th">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ThContext>("th", () => ({
  scope,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ThSlots>();
</script>

<template>
  <th ref="el" :scope="scope" class="f-th" v-bind="bindings">
    <slot v-bind="ctx" />
  </th>
</template>
