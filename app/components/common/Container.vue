<script lang="ts">
import type { ContainerProps } from "#foundation/types/common/container";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<ContainerProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <div ref="el" :aria-label="label" class="f-container">
    <slot>{{ label }}</slot>
  </div>
</template>
