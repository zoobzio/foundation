<script lang="ts">
import type {
  ImgBindings,
  ImgContext,
  ImgProps,
} from "#foundation/types/common/img";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { src, alt, modifiers, tokens, aria } = defineProps<ImgProps>();

const el = useTemplateRef<HTMLImageElement>("el");

const bindings = computed<ImgBindings>(() =>
  useBindings<"img">(modifiers, tokens, aria),
);

const ctx = computed<ImgContext>(() => ({
  src,
  alt,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <img ref="el" :src="src" :alt="alt" class="f-img" v-bind="bindings" />
</template>
