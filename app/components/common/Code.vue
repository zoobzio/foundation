<script lang="ts">
import type { CodeProps } from "#foundation/types/common/code";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<CodeProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <code ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-code">
    <slot />
  </code>
</template>
