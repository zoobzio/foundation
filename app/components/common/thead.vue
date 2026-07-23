<script lang="ts">
import type {
  TheadBindings,
  TheadContext,
  TheadProps,
  TheadSlots,
} from "#foundation/types/common/thead";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TheadProps>();

defineSlots<TheadSlots>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const bindings = computed<TheadBindings>(() =>
  useBindings<"thead">(modifiers, tokens, aria),
);

const ctx = computed<TheadContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <thead ref="el" class="f-thead" v-bind="bindings">
    <slot :ctx="ctx" />
  </thead>
</template>
