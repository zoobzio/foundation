<script lang="ts">
import type {
  H4Bindings,
  H4Context,
  H4Props,
  H4Slots,
} from "#foundation/types/common/h4";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H4Props>();

defineSlots<H4Slots>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = computed<H4Bindings>(() =>
  useBindings<"h4">(modifiers, tokens, aria),
);

const ctx = computed<H4Context>(() => ({
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
  <h4 ref="el" class="f-h4" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </h4>
</template>
