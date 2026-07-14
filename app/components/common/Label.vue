<script lang="ts">
import type { LabelProps } from "#foundation/types/common/label";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { for: htmlFor, variant, size, color, radius, density, elevation } = defineProps<LabelProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <label ref="el" :for="htmlFor" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-label">
    <slot />
  </label>
</template>
