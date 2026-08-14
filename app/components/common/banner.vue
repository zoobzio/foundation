<script lang="ts">
import type {
  BannerContext,
  BannerProps,
  BannerSlots,
} from "../../types/common/banner";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<BannerProps>();

const el = useTemplateRef<HTMLDivElement>("el");

const bindings = useBindings<"banner">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<BannerContext>("banner", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<BannerSlots>();
</script>

<template>
  <div ref="el" role="banner" class="f-banner" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </div>
</template>
