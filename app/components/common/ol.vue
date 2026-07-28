<script lang="ts">
import type {
  OlContext,
  OlProps,
  OlSlots,
} from "#foundation/types/common/ol";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<OlProps>();

const el = useTemplateRef<HTMLOListElement>("el");

const bindings = useBindings<"ol">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<OlContext>("ol", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<OlSlots>();
</script>

<template>
  <ol ref="el" class="f-ol" v-bind="bindings">
    <slot v-bind="ctx" />
  </ol>
</template>
