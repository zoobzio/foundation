<script lang="ts">
import type { StrongProps } from "#foundation/types/common/strong";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<StrongProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <strong ref="el" class="f-strong">
    <slot>{{ label }}</slot>
  </strong>
</template>
