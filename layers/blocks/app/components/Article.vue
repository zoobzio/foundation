<script setup lang="ts">
import type { ArticleProps } from "../types/article";

const { tokens } = defineProps<ArticleProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <article :style="styles.article" class="f-article">
    <slot />
  </article>
</template>

<style>
@import '#build/untheme/article.css';
</style>
