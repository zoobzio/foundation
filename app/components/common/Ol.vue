<script lang="ts">
import type { OlProps } from "#foundation/types/common/ol";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<OlProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <ol ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-ol">
    <slot />
  </ol>
</template>
