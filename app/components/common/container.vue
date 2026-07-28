<script lang="ts">
import type {
  ContainerContext,
  ContainerProps,
  ContainerSlots,
} from "#foundation/types/common/container";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<ContainerProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"container">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ContainerContext>("container", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ContainerSlots>();
</script>

<template>
  <div ref="el" class="f-container" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
