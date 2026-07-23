<script lang="ts">
import type {
  H1Bindings,
  H1Context,
  H1Props,
  H1Slots,
} from "#foundation/types/common/h1";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H1Props>();

defineSlots<H1Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H1Bindings>(() =>
  useBindings<"h1">(modifiers, tokens, aria),
);

const ctx = computed<H1Context>(() => ({
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
  <h1 ref="el" class="f-h1" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h1>
</template>
