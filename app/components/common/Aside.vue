<script lang="ts">
import type { AsideProps } from "#foundation/types/common/aside";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { label, variant, size, color, radius, density, elevation } = defineProps<AsideProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <aside ref="el" :aria-label="label" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-aside">
    <slot>{{ label }}</slot>
  </aside>
</template>
