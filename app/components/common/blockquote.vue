<script lang="ts">
import type {
  BlockquoteBindings,
  BlockquoteContext,
  BlockquoteProps,
  BlockquoteSlots,
} from "#foundation/types/common/blockquote";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<BlockquoteProps>();

defineSlots<BlockquoteSlots>();

const el = useTemplateRef<HTMLQuoteElement>("el");

const bindings = computed<BlockquoteBindings>(() =>
  useBindings<"blockquote">(modifiers, tokens, aria),
);

const ctx = computed<BlockquoteContext>(() => ({
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
  <blockquote ref="el" class="f-blockquote" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </blockquote>
</template>
