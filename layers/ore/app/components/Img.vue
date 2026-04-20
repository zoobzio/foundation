<script lang="ts">
import type { ImgProps } from "../types/img";
</script>

<script setup lang="ts">
const { src, alt, variant, size, color, radius, density, elevation } = defineProps<ImgProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <img ref="el" :src="src" :alt="alt" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-img" >
</template>
