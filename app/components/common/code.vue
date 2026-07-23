<script lang="ts">
import type {
  CodeBindings,
  CodeContext,
  CodeProps,
  CodeSlots,
} from "#foundation/types/common/code";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CodeProps>();

defineSlots<CodeSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<CodeBindings>(() =>
  useBindings<"code">(modifiers, tokens, aria),
);

const ctx = computed<CodeContext>(() => ({
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
  <code ref="el" class="f-code" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </code>
</template>
