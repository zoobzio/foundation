<script lang="ts">
import type { InputProps } from "../types/input";
</script>

<script setup lang="ts">
const { type = "text", variant, size, color, radius, density, elevation } = defineProps<InputProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <input ref="el" :type="type" :placeholder="placeholder" :disabled="disabled" :required="required" :name="name" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-input">
</template>
