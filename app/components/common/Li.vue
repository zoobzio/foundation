<script lang="ts">
import type { LiProps } from "#foundation/types/common/li";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<LiProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <li ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-li">
    <slot />
  </li>
</template>
