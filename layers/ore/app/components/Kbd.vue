<script lang="ts">
import type { KbdProps } from "../types/kbd";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<KbdProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <kbd ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-kbd">
    <slot />
  </kbd>
</template>
