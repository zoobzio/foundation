<script lang="ts">
import type {
  H2Context,
  H2Props,
  H2Slots,
} from "../../types/common/h2";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H2Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h2">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H2Context>("h2", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H2Slots>();
</script>

<template>
  <h2 ref="el" class="f-h2" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h2>
</template>
