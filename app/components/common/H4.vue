<script lang="ts">
import type { H4Props } from "#foundation/types/common/h4";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<H4Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h4 ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-h4">
    <slot />
  </h4>
</template>
