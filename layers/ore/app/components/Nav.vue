<script lang="ts">
import type { NavProps } from "../types/nav";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<NavProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <nav ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-nav">
    <slot />
  </nav>
</template>
