<script lang="ts">
import type { H6Props } from "#foundation/types/common/h6";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H6Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h6 ref="el" class="f-h6">
    <slot>{{ label }}</slot>
  </h6>
</template>
