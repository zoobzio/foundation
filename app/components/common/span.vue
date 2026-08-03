<script lang="ts">
import type {
  SpanContext,
  SpanProps,
  SpanSlots,
} from "#foundation/types/common/span";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<SpanProps>();

const el = useTemplateRef<HTMLSpanElement>("el");

const bindings = useBindings<"span">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<SpanContext>("span", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SpanSlots>();
</script>

<template>
  <span ref="el" class="f-span" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </span>
</template>
