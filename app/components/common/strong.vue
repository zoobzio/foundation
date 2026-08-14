<script lang="ts">
import type {
  StrongContext,
  StrongProps,
  StrongSlots,
} from "../../types/common/strong";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<StrongProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"strong">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<StrongContext>("strong", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<StrongSlots>();
</script>

<template>
  <strong ref="el" class="f-strong" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </strong>
</template>
