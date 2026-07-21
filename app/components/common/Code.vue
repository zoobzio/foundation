<script lang="ts">
import type { CodeProps } from "#foundation/types/common/code";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<CodeProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <code ref="el" class="f-code">
    <slot>{{ label }}</slot>
  </code>
</template>
