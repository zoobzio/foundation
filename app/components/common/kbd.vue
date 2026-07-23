<script lang="ts">
import type {
  KbdBindings,
  KbdContext,
  KbdProps,
  KbdSlots,
} from "#foundation/types/common/kbd";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<KbdProps>();

defineSlots<KbdSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<KbdBindings>(() =>
  useBindings<"kbd">(modifiers, tokens, aria),
);

const ctx = computed<KbdContext>(() => ({
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
  <kbd ref="el" class="f-kbd" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </kbd>
</template>
