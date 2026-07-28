<script lang="ts">
import type {
  CaptionContext,
  CaptionProps,
  CaptionSlots,
} from "#foundation/types/common/caption";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CaptionProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"caption">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<CaptionContext>("caption", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CaptionSlots>();
</script>

<template>
  <div ref="el" class="f-caption" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
