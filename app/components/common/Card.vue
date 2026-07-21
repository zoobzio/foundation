<script lang="ts">
import type { CardProps } from "#foundation/types/common/card";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<CardProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :aria-label="label" class="f-card">
    <slot>{{ label }}</slot>
  </div>
</template>
