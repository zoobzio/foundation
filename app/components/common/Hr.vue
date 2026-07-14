<script lang="ts">
import type { HrProps } from "#foundation/types/common/hr";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { variant, size, color, radius, density, elevation } = defineProps<HrProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <hr ref="el" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-hr" >
</template>
