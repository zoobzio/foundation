<script lang="ts">
import type {
  PBindings,
  PContext,
  PProps,
  PSlots,
} from "#foundation/types/common/p";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<PProps>();

defineSlots<PSlots>();

const el = useTemplateRef<HTMLParagraphElement>("el");

const bindings = computed<PBindings>(() =>
  useBindings<"p">(modifiers, tokens, aria),
);

const ctx = computed<PContext>(() => ({
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
  <p ref="el" class="f-p" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </p>
</template>
