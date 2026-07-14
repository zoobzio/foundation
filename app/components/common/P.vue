<script lang="ts">
import type { PProps } from "#foundation/types/common/p";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<PProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <p ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-p">
    <slot />
  </p>
</template>
