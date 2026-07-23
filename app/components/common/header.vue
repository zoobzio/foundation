<script lang="ts">
import type {
  HeaderBindings,
  HeaderContext,
  HeaderProps,
  HeaderSlots,
} from "#foundation/types/common/header";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<HeaderProps>();

defineSlots<HeaderSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<HeaderBindings>(() =>
  useBindings<"header">(modifiers, tokens, aria),
);

const ctx = computed<HeaderContext>(() => ({
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
  <header ref="el" class="f-header" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </header>
</template>
