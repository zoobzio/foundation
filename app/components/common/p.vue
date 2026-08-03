<script lang="ts">
import type {
  PContext,
  PProps,
  PSlots,
} from "#foundation/types/common/p";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<PProps>();

const el = useTemplateRef<HTMLParagraphElement>("el");

const bindings = useBindings<"p">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<PContext>("p", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PSlots>();
</script>

<template>
  <p ref="el" class="f-p" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </p>
</template>
