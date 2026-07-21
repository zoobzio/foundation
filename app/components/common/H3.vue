<script lang="ts">
import type { H3Props } from "#foundation/types/common/h3";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H3Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h3 ref="el" class="f-h3">
    <slot>{{ label }}</slot>
  </h3>
</template>
