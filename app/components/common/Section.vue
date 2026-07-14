<script lang="ts">
import type { SectionProps } from "#foundation/types/common/section";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { label, variant, size, color, radius, density, elevation } = defineProps<SectionProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <section ref="el" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-section">
    <slot>{{ label }}</slot>
  </section>
</template>
