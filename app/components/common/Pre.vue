<script lang="ts">
import type { PreProps } from "#foundation/types/common/pre";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<PreProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <pre ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-pre"><slot /></pre>
</template>
