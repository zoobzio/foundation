<script lang="ts">
import type {
  LabelBindings,
  LabelContext,
  LabelProps,
  LabelSlots,
} from "#foundation/types/common/label";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { for: htmlFor, modifiers, tokens, aria } = defineProps<LabelProps>();

defineSlots<LabelSlots>();

const el = useTemplateRef<HTMLLabelElement>("el");

const bindings = computed<LabelBindings>(() =>
  useBindings<"label">(modifiers, tokens, aria),
);

const ctx = computed<LabelContext>(() => ({
  for: htmlFor,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <label ref="el" :for="htmlFor" class="f-label" v-bind="bindings">
    <slot :ctx="ctx" />
  </label>
</template>
