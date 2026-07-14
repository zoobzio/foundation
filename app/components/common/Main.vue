<script lang="ts">
import type { MainProps } from "#foundation/types/common/main";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { label, variant, size, color, radius, density, elevation } = defineProps<MainProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <main ref="el" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-main">
    <slot>{{ label }}</slot>
  </main>
</template>
