<script lang="ts">
import type {
  AsideBindings,
  AsideContext,
  AsideProps,
  AsideSlots,
} from "#foundation/types/common/aside";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<AsideProps>();

defineSlots<AsideSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<AsideBindings>(() =>
  useBindings<"aside">(modifiers, tokens, aria),
);

const ctx = computed<AsideContext>(() => ({
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
  <aside ref="el" class="f-aside" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </aside>
</template>
