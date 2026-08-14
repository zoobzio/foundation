<script lang="ts">
import type {
  TheadContext,
  TheadProps,
  TheadSlots,
} from "../../types/common/thead";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<TheadProps>();

const el = useTemplateRef<HTMLTableSectionElement>("el");

const bindings = useBindings<"thead">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TheadContext>("thead", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TheadSlots>();
</script>

<template>
  <thead ref="el" class="f-thead" v-bind="bindings">
    <slot v-bind="ctx" />
  </thead>
</template>
