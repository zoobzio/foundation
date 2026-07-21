<script lang="ts">
import type { H4Props } from "#foundation/types/common/h4";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<H4Props>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <h4 ref="el" class="f-h4">
    <slot>{{ label }}</slot>
  </h4>
</template>
