<script lang="ts">
import type {
  H6Bindings,
  H6Context,
  H6Props,
  H6Slots,
} from "#foundation/types/common/h6";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H6Props>();

defineSlots<H6Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H6Bindings>(() =>
  useBindings<"h6">(modifiers, tokens, aria),
);

const ctx = computed<H6Context>(() => ({
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
  <h6 ref="el" class="f-h6" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h6>
</template>
