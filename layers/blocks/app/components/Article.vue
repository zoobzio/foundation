<script setup lang="ts">
import type { ArticleProps } from "../types/article";

defineProps<ArticleProps>();

</script>

<template>
  <article class="f-article">
    <slot />
  </article>
</template>

