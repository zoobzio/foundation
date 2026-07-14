<script lang="ts">
import type { UlProps } from "#foundation/types/common/ul";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<UlProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <ul ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-ul">
    <slot />
  </ul>
</template>
