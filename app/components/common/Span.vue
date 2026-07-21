<script lang="ts">
import type { SpanProps } from "#foundation/types/common/span";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<SpanProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <span ref="el" class="f-span">
    <slot>{{ label }}</slot>
  </span>
</template>
