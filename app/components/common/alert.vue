<script lang="ts">
import type {
  AlertContext,
  AlertProps,
  AlertSlots,
} from "../../types/common/alert";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<AlertProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"alert">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<AlertContext>("alert", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AlertSlots>();
</script>

<template>
  <div ref="el" role="alert" class="f-alert" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
