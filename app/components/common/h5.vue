<script lang="ts">
import type {
  H5Context,
  H5Props,
  H5Slots,
} from "#foundation/types/common/h5";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H5Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h5">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H5Context>("h5", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H5Slots>();
</script>

<template>
  <h5 ref="el" class="f-h5" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h5>
</template>
