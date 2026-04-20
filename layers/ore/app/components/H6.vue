<script lang="ts">
import type { H6Props } from "../types/h6";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<H6Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h6 ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-h6">
    <slot />
  </h6>
</template>
