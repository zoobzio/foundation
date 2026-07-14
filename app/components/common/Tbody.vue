<script lang="ts">
import type { TbodyProps } from "#foundation/types/common/tbody";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<TbodyProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <tbody ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-tbody">
    <slot />
  </tbody>
</template>
