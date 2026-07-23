<script lang="ts">
import type {
  LiBindings,
  LiContext,
  LiProps,
  LiSlots,
} from "#foundation/types/common/li";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<LiProps>();

defineSlots<LiSlots>();

const el = useTemplateRef<HTMLLIElement>("el");

const bindings = computed<LiBindings>(() =>
  useBindings<"li">(modifiers, tokens, aria),
);

const ctx = computed<LiContext>(() => ({
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
  <li ref="el" class="f-li" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </li>
</template>
