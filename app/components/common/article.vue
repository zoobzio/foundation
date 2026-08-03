<script lang="ts">
import type {
  ArticleContext,
  ArticleProps,
  ArticleSlots,
} from "#foundation/types/common/article";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { label, modifiers, tokens, aria } = defineProps<ArticleProps>();

const el = useTemplateRef<HTMLElement>("el");

const bindings = useBindings<"article">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ArticleContext>("article", () => ({
  label,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ArticleSlots>();
</script>

<template>
  <article ref="el" class="f-article" v-bind="bindings">
    <slot v-bind="ctx">{{ label }}</slot>
  </article>
</template>
