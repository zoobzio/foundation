<script lang="ts">
import type { H1Props } from "#foundation/types/common/h1";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H1Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h1 ref="el" class="f-h1">
    <slot>{{ label }}</slot>
  </h1>
</template>
