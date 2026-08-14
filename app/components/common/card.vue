<script lang="ts">
import type {
  CardContext,
  CardProps,
  CardSlots,
} from "../../types/common/card";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<CardProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"card">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<CardContext>("card", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CardSlots>();
</script>

<template>
  <div ref="el" class="f-card" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
