<script lang="ts">
import type {
  KbdContext,
  KbdProps,
  KbdSlots,
} from "#foundation/types/common/kbd";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<KbdProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"kbd">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<KbdContext>("kbd", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<KbdSlots>();
</script>

<template>
  <kbd ref="el" class="f-kbd" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </kbd>
</template>
