<script lang="ts">
import type {
  FooterContext,
  FooterProps,
  FooterSlots,
} from "#foundation/types/common/footer";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<FooterProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"footer">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<FooterContext>("footer", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<FooterSlots>();
</script>

<template>
  <footer ref="el" class="f-footer" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </footer>
</template>
