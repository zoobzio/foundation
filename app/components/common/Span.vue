<script lang="ts">
import type { SpanProps } from "#foundation/types/common/span";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<SpanProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <span ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-span">
    <slot />
  </span>
</template>
