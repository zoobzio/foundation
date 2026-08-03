<script lang="ts">
import type {
  CodeContext,
  CodeProps,
  CodeSlots,
} from "#foundation/types/common/code";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CodeProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"code">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<CodeContext>("code", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CodeSlots>();
</script>

<template>
  <code ref="el" class="f-code" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </code>
</template>
