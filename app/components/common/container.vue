<script lang="ts">
import type {
  ContainerBindings,
  ContainerContext,
  ContainerProps,
  ContainerSlots,
} from "#foundation/types/common/container";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<ContainerProps>();

defineSlots<ContainerSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<ContainerBindings>(() =>
  useBindings<"container">(modifiers, tokens, aria),
);

const ctx = computed<ContainerContext>(() => ({
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
  <div ref="el" class="f-container" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
