<script lang="ts">
import type { PreProps } from "#foundation/types/common/pre";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<PreProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <pre ref="el" class="f-pre"><slot>{{ label }}</slot></pre>
</template>
