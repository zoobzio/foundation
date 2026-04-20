<script lang="ts">
import type { H5Props } from "../types/h5";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<H5Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h5 ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-h5">
    <slot />
  </h5>
</template>
