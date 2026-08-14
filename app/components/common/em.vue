<script lang="ts">
import type {
  EmContext,
  EmProps,
  EmSlots,
} from "../../types/common/em";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<EmProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"em">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<EmContext>("em", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<EmSlots>();
</script>

<template>
  <em ref="el" class="f-em" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </em>
</template>
