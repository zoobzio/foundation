<script lang="ts">
import type {
  H6Context,
  H6Props,
  H6Slots,
} from "../../types/common/h6";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<H6Props>();

const el = useTemplateRef<HTMLHeadingElement>("el");

const bindings = useBindings<"h6">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<H6Context>("h6", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<H6Slots>();
</script>

<template>
  <h6 ref="el" class="f-h6" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </h6>
</template>
