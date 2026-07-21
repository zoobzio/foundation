<script lang="ts">
import type { IconProps } from "#foundation/types/common/icon";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { alias, label } = defineProps<IconProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <svg ref="el" :aria-hidden="!label" :aria-label="label || undefined" :role="label ? 'img' : undefined" class="f-icon" fill="currentColor">
    <use :href="'/icons.svg#' + alias" />
  </svg>
</template>
