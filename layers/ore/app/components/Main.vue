<script lang="ts">
import type { MainProps } from "../types/main";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<MainProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <main ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-main">
    <slot />
  </main>
</template>
