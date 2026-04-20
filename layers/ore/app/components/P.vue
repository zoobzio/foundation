<script lang="ts">
import type { PProps } from "../types/p";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<PProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <p ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-p">
    <slot />
  </p>
</template>
