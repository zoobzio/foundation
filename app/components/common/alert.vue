<script lang="ts">
import type {
  AlertBindings,
  AlertContext,
  AlertProps,
  AlertSlots,
} from "#foundation/types/common/alert";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<AlertProps>();

defineSlots<AlertSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<AlertBindings>(() =>
  useBindings<"alert">(modifiers, tokens, aria),
);

const ctx = computed<AlertContext>(() => ({
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
  <div ref="el" role="alert" class="f-alert" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
