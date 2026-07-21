<script lang="ts">
import type { ButtonProps } from "#foundation/types/common/button";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label, type = "button", disabled, ariaPressed, ariaExpanded, ariaHaspopup } = defineProps<ButtonProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <button ref="el" :type="type" :aria-label="label" :aria-pressed="ariaPressed" :aria-expanded="ariaExpanded" :aria-haspopup="ariaHaspopup" :disabled="disabled" class="f-button">
    <slot>{{ label }}</slot>
  </button>
</template>
