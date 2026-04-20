<script lang="ts">
import type { CaptionProps } from "../types/caption";
</script>

<script setup lang="ts">
const { icon, variant, size, color, radius, density, elevation } = defineProps<CaptionProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-caption">
    <Icon v-if="icon" :alias="icon" />
    <slot />
  </div>
</template>
