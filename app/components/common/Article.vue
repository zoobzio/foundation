<script lang="ts">
import type { ArticleProps } from "#foundation/types/common/article";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<ArticleProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <article ref="el" :aria-label="label" class="f-article">
    <slot>{{ label }}</slot>
  </article>
</template>
