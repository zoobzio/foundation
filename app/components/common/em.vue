<script lang="ts">
import type {
  EmBindings,
  EmContext,
  EmProps,
  EmSlots,
} from "#foundation/types/common/em";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<EmProps>();

defineSlots<EmSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<EmBindings>(() =>
  useBindings<"em">(modifiers, tokens, aria),
);

const ctx = computed<EmContext>(() => ({
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
  <em ref="el" class="f-em" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </em>
</template>
