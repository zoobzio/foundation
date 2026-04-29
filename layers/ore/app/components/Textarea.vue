<script lang="ts">
import type { TextareaProps } from "../types/textarea";
</script>

<script setup lang="ts">
const { label, ariaDescribedby, ariaInvalid, variant, size, color, radius, density, elevation } = defineProps<TextareaProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <textarea ref="el" :aria-label="label" :aria-describedby="ariaDescribedby" :aria-invalid="ariaInvalid" :placeholder="placeholder" :disabled="disabled" :required="required" :name="name" :rows="rows" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-textarea" />
</template>
