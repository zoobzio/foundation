<script lang="ts">
import type { CardProps } from "../types/card";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<CardProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-card">
    <slot />
  </div>
</template>
