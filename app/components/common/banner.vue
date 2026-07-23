<script lang="ts">
import type {
  BannerBindings,
  BannerContext,
  BannerProps,
  BannerSlots,
} from "#foundation/types/common/banner";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<BannerProps>();

defineSlots<BannerSlots>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = computed<BannerBindings>(() =>
  useBindings<"banner">(modifiers, tokens, aria),
);

const ctx = computed<BannerContext>(() => ({
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
  <div ref="el" role="banner" class="f-banner" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </div>
</template>
