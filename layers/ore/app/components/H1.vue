<script lang="ts">
import type { H1Props } from "../types/h1";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<H1Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h1 ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-h1">
    <slot />
  </h1>
</template>
