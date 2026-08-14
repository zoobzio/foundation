<script lang="ts">
import type {
  H1Context,
  H1Props,
  H1Slots,
} from "../../types/common/h1";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H1Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h1">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H1Context>("h1", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H1Slots>();
</script>

<template>
  <h1 ref="el" class="f-h1" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h1>
</template>
