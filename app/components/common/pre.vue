<script lang="ts">
import type {
  PreBindings,
  PreContext,
  PreProps,
  PreSlots,
} from "#foundation/types/common/pre";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<PreProps>();

defineSlots<PreSlots>();

const el = useTemplateRef<HTMLPreElement>("el");

const bindings = computed<PreBindings>(() =>
  useBindings<"pre">(modifiers, tokens, aria),
);

const ctx = computed<PreContext>(() => ({
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
  <pre ref="el" class="f-pre" v-bind="bindings"><slot :ctx="ctx">{{ label }}</slot></pre>
</template>
