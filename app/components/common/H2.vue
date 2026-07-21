<script lang="ts">
import type { H2Props } from "#foundation/types/common/h2";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H2Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h2 ref="el" class="f-h2">
    <slot>{{ label }}</slot>
  </h2>
</template>
