<script lang="ts">
import type {
  H3Context,
  H3Props,
  H3Slots,
} from "#foundation/types/common/h3";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H3Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h3">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H3Context>("h3", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H3Slots>();
</script>

<template>
  <h3 ref="el" class="f-h3" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h3>
</template>
