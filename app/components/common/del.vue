<script lang="ts">
import type {
  DelBindings,
  DelContext,
  DelProps,
  DelSlots,
} from "#foundation/types/common/del";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<DelProps>();

defineSlots<DelSlots>();

const el = useTemplateRef<HTMLModElement>("el");

const bindings = computed<DelBindings>(() =>
  useBindings<"del">(modifiers, tokens, aria),
);

const ctx = computed<DelContext>(() => ({
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
  <del ref="el" class="f-del" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </del>
</template>
