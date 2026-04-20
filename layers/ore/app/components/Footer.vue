<script lang="ts">
import type { FooterProps } from "../types/footer";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<FooterProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <footer ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-footer">
    <slot />
  </footer>
</template>
