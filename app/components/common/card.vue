<script lang="ts">
import type {
  CardBindings,
  CardContext,
  CardProps,
  CardSlots,
} from "#foundation/types/common/card";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CardProps>();

defineSlots<CardSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<CardBindings>(() =>
  useBindings<"card">(modifiers, tokens, aria),
);

const ctx = computed<CardContext>(() => ({
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
  <div ref="el" class="f-card" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
