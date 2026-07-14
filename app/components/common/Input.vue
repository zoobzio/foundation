<script lang="ts">
import type { InputProps } from "#foundation/types/common/input";
</script>

<script setup lang="ts">
import { useTemplateRef } from "#imports";
const { type = "text", label, ariaDescribedby, ariaInvalid, variant, size, color, radius, density, elevation } = defineProps<InputProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <input ref="el" :type="type" :aria-label="label" :aria-describedby="ariaDescribedby" :aria-invalid="ariaInvalid" :placeholder="placeholder" :disabled="disabled" :required="required" :name="name" :data-variant="variant" :data-size="size" :data-color="color" :data-radius="radius" :data-density="density" :data-elevation="elevation" class="f-input">
</template>
