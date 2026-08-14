<script lang="ts">
import type {
  HeaderContext,
  HeaderProps,
  HeaderSlots,
} from "../../types/common/header";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<HeaderProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"header">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<HeaderContext>("header", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<HeaderSlots>();
</script>

<template>
  <header ref="el" class="f-header" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </header>
</template>
