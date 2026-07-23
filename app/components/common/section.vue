<script lang="ts">
import type {
  SectionBindings,
  SectionContext,
  SectionProps,
  SectionSlots,
} from "#foundation/types/common/section";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<SectionProps>();

defineSlots<SectionSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<SectionBindings>(() =>
  useBindings<"section">(modifiers, tokens, aria),
);

const ctx = computed<SectionContext>(() => ({
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
  <section ref="el" class="f-section" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </section>
</template>
