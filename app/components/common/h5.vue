<script lang="ts">
import type {
  H5Bindings,
  H5Context,
  H5Props,
  H5Slots,
} from "#foundation/types/common/h5";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H5Props>();

defineSlots<H5Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H5Bindings>(() =>
  useBindings<"h5">(modifiers, tokens, aria),
);

const ctx = computed<H5Context>(() => ({
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
  <h5 ref="el" class="f-h5" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h5>
</template>
