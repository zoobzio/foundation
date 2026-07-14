<script lang="ts">
import type { TheadProps } from "#foundation/types/common/thead";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<TheadProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <thead ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-thead">
    <slot />
  </thead>
</template>
