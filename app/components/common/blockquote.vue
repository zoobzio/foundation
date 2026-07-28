<script lang="ts">
import type {
  BlockquoteContext,
  BlockquoteProps,
  BlockquoteSlots,
} from "#foundation/types/common/blockquote";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<BlockquoteProps>();

const el = useTemplateRef<HTMLQuoteElement>("el");

const bindings = useBindings<"blockquote">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<BlockquoteContext>("blockquote", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<BlockquoteSlots>();
</script>

<template>
  <blockquote ref="el" class="f-blockquote" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </blockquote>
</template>
