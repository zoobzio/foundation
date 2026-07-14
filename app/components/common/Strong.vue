<script lang="ts">
import type { StrongProps } from "#foundation/types/common/strong";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<StrongProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <strong ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-strong">
    <slot />
  </strong>
</template>
