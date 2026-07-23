<script lang="ts">
import type {
  UlBindings,
  UlContext,
  UlProps,
  UlSlots,
} from "#foundation/types/common/ul";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<UlProps>();

defineSlots<UlSlots>();

const el = useTemplateRef<HTMLUListElement>("el");

const bindings = computed<UlBindings>(() =>
  useBindings<"ul">(modifiers, tokens, aria),
);

const ctx = computed<UlContext>(() => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <ul ref="el" class="f-ul" v-bind="bindings">
    <slot :ctx="ctx" />
  </ul>
</template>
