<script lang="ts">
import type { TdProps } from "../types/td";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<TdProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <td ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-td">
    <slot />
  </td>
</template>
