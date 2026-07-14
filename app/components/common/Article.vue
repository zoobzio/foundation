<script lang="ts">
import type { ArticleProps } from "#foundation/types/common/article";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { label, variant, size, color, radius, density, elevation } = defineProps<ArticleProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <article ref="el" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-article">
    <slot>{{ label }}</slot>
  </article>
</template>
