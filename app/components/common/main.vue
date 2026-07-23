<script lang="ts">
import type {
  MainBindings,
  MainContext,
  MainProps,
  MainSlots,
} from "#foundation/types/common/main";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<MainProps>();

defineSlots<MainSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<MainBindings>(() =>
  useBindings<"main">(modifiers, tokens, aria),
);

const ctx = computed<MainContext>(() => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <main ref="el" class="f-main" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </main>
</template>
