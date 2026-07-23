<script lang="ts">
import type {
  FooterBindings,
  FooterContext,
  FooterProps,
  FooterSlots,
} from "#foundation/types/common/footer";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<FooterProps>();

defineSlots<FooterSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<FooterBindings>(() =>
  useBindings<"footer">(modifiers, tokens, aria),
);

const ctx = computed<FooterContext>(() => ({
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
  <footer ref="el" class="f-footer" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </footer>
</template>
