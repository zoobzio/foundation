<script lang="ts">
import type { TextareaProps } from "#foundation/types/common/textarea";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label, ariaDescribedby, ariaInvalid } = defineProps<TextareaProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <textarea ref="el" :aria-label="label" :aria-describedby="ariaDescribedby" :aria-invalid="ariaInvalid" :placeholder="placeholder" :disabled="disabled" :required="required" :name="name" :rows="rows" class="f-textarea" />
</template>
