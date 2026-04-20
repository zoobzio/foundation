<script lang="ts">
import type { HrProps } from "../types/hr";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<HrProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <hr ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-hr" >
</template>
