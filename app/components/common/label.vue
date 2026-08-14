<script lang="ts">
import type {
  LabelContext,
  LabelProps,
  LabelSlots,
} from "../../types/common/label";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { for: htmlFor, modifiers, tokens, aria } = defineProps<LabelProps>();

const el = useTemplateRef<HTMLLabelElement>("el");

const bindings = useBindings<"label">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<LabelContext>("label", () => ({
  for: htmlFor,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<LabelSlots>();
</script>

<template>
  <label ref="el" :for="htmlFor" class="f-label" v-bind="bindings">
    <slot v-bind="ctx" />
  </label>
</template>
