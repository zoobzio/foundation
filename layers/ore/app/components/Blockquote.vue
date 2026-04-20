<script lang="ts">
import type { BlockquoteProps } from "../types/blockquote";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<BlockquoteProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <blockquote ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-blockquote">
    <slot />
  </blockquote>
</template>
