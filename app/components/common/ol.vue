<script lang="ts">
import type {
  OlBindings,
  OlContext,
  OlProps,
  OlSlots,
} from "#foundation/types/common/ol";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<OlProps>();

defineSlots<OlSlots>();

const el = useTemplateRef<HTMLOListElement>("el");

const bindings = computed<OlBindings>(() =>
  useBindings<"ol">(modifiers, tokens, aria),
);

const ctx = computed<OlContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <ol ref="el" class="f-ol" v-bind="bindings">
    <slot :ctx="ctx" />
  </ol>
</template>
