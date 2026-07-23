<script lang="ts">
import type {
  H3Bindings,
  H3Context,
  H3Props,
  H3Slots,
} from "#foundation/types/common/h3";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H3Props>();

defineSlots<H3Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H3Bindings>(() =>
  useBindings<"h3">(modifiers, tokens, aria),
);

const ctx = computed<H3Context>(() => ({
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
  <h3 ref="el" class="f-h3" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h3>
</template>
