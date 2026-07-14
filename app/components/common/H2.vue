<script lang="ts">
import type { H2Props } from "#foundation/types/common/h2";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<H2Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h2 ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-h2">
    <slot />
  </h2>
</template>
