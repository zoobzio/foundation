<script lang="ts">
import type { H5Props } from "#foundation/types/common/h5";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H5Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h5 ref="el" class="f-h5">
    <slot>{{ label }}</slot>
  </h5>
</template>
