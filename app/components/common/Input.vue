<script lang="ts">
import type { InputProps } from "#foundation/types/common/input";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { type = "text", label, ariaDescribedby, ariaInvalid } = defineProps<InputProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <input ref="el" :type="type" :aria-label="label" :aria-describedby="ariaDescribedby" :aria-invalid="ariaInvalid" :placeholder="placeholder" :disabled="disabled" :required="required" :name="name" class="f-input">
</template>
