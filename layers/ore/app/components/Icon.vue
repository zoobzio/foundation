<script lang="ts">
import type { IconProps } from "../types/icon";
</script>

<script setup lang="ts">
const { alias, label, variant, size, color, radius, density, elevation } = defineProps<IconProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <svg ref="el" :aria-hidden="!label" :aria-label="label || undefined" :role="label ? 'img' : undefined" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-icon" fill="currentColor">
    <use :href="'/icons.svg#' + alias" />
  </svg>
</template>
