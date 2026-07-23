<script lang="ts">
import type {
  ThBindings,
  ThContext,
  ThProps,
  ThSlots,
} from "#foundation/types/common/th";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { scope, modifiers, tokens, aria } = defineProps<ThProps>();

defineSlots<ThSlots>();

const el = useTemplateRef<HTMLTableCellElement>("el");

const bindings = computed<ThBindings>(() =>
  useBindings<"th">(modifiers, tokens, aria),
);

const ctx = computed<ThContext>(() => ({
  scope,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <th ref="el" :scope="scope" class="f-th" v-bind="bindings">
    <slot :ctx="ctx" />
  </th>
</template>
