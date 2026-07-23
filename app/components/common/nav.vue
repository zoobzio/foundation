<script lang="ts">
import type {
  NavBindings,
  NavContext,
  NavProps,
  NavSlots,
} from "#foundation/types/common/nav";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<NavProps>();

defineSlots<NavSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<NavBindings>(() =>
  useBindings<"nav">(modifiers, tokens, aria),
);

const ctx = computed<NavContext>(() => ({
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
  <nav ref="el" class="f-nav" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </nav>
</template>
