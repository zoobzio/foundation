<script lang="ts">
import type { AsideProps } from "../types/aside";
</script>

<script setup lang="ts">
const { variant, size, color, radius, density, elevation } = defineProps<AsideProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <aside ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-aside">
    <slot />
  </aside>
</template>
