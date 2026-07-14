<script lang="ts">
import type { FieldsetProps } from "#foundation/types/common/fieldset";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { legend, variant, size, color, radius, density, elevation } = defineProps<FieldsetProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <fieldset ref="el" :disabled="disabled" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-fieldset">
    <legend v-if="legend" class="f-fieldset-legend">{{ legend }}</legend>
    <slot />
  </fieldset>
</template>
