<script lang="ts">
import type {
  H4Context,
  H4Props,
  H4Slots,
} from "../../types/common/h4";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H4Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h4">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H4Context>("h4", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H4Slots>();
</script>

<template>
  <h4 ref="el" class="f-h4" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h4>
</template>
