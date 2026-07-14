<script lang="ts">
import type { EmProps } from "#foundation/types/common/em";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<EmProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <em ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-em">
    <slot />
  </em>
</template>
