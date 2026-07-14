<script lang="ts">
import type { TrProps } from "#foundation/types/common/tr";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<TrProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <tr ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-tr">
    <slot />
  </tr>
</template>
