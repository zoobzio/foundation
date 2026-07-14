<script lang="ts">
import type { DelProps } from "#foundation/types/common/del";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<DelProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <del ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-del">
    <slot />
  </del>
</template>
