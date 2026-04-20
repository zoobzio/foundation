<script lang="ts">
import type { ArticleProps } from "../types/article";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<ArticleProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <article ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-article">
    <slot />
  </article>
</template>
