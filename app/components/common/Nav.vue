<script lang="ts">
import type { NavProps } from "#foundation/types/common/nav";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { label, variant, size, color, radius, density, elevation } = defineProps<NavProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <nav ref="el" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-nav">
    <slot>{{ label }}</slot>
  </nav>
</template>
