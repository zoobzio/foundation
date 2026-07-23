<script lang="ts">
import type {
  StrongBindings,
  StrongContext,
  StrongProps,
  StrongSlots,
} from "#foundation/types/common/strong";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<StrongProps>();

defineSlots<StrongSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<StrongBindings>(() =>
  useBindings<"strong">(modifiers, tokens, aria),
);

const ctx = computed<StrongContext>(() => ({
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
  <strong ref="el" class="f-strong" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </strong>
</template>
