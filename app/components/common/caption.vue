<script lang="ts">
import type {
  CaptionBindings,
  CaptionContext,
  CaptionProps,
  CaptionSlots,
} from "#foundation/types/common/caption";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CaptionProps>();

defineSlots<CaptionSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<CaptionBindings>(() =>
  useBindings<"caption">(modifiers, tokens, aria),
);

const ctx = computed<CaptionContext>(() => ({
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
  <div ref="el" class="f-caption" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
