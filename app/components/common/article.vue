<script lang="ts">
import type {
  ArticleBindings,
  ArticleContext,
  ArticleProps,
  ArticleSlots,
} from "#foundation/types/common/article";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<ArticleProps>();

defineSlots<ArticleSlots>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = computed<ArticleBindings>(() =>
  useBindings<"article">(modifiers, tokens, aria),
);

const ctx = computed<ArticleContext>(() => ({
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
  <article ref="el" class="f-article" v-bind="bindings">
    <slot :ctx="ctx">{{ label }}</slot>
  </article>
</template>
