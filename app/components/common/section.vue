<script lang="ts">
import type {
  SectionContext,
  SectionProps,
  SectionSlots,
} from "../../types/common/section";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<SectionProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"section">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<SectionContext>("section", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SectionSlots>();
</script>

<template>
  <section ref="el" class="f-section" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </section>
</template>
