<script lang="ts">
import type {
  H2Bindings,
  H2Context,
  H2Props,
  H2Slots,
} from "#foundation/types/common/h2";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H2Props>();

defineSlots<H2Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H2Bindings>(() =>
  useBindings<"h2">(modifiers, tokens, aria),
);

const ctx = computed<H2Context>(() => ({
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
  <h2 ref="el" class="f-h2" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h2>
</template>
