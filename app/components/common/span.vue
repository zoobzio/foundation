<script lang="ts">
import type {
  SpanBindings,
  SpanContext,
  SpanProps,
  SpanSlots,
} from "#foundation/types/common/span";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<SpanProps>();

defineSlots<SpanSlots>();

const el = useTemplateRef<HTMLSpanElement>("el");

const bindings = computed<SpanBindings>(() =>
  useBindings<"span">(modifiers, tokens, aria),
);

const ctx = computed<SpanContext>(() => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <span ref="el" class="f-span" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </span>
</template>
