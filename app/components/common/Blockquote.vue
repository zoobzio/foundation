<script lang="ts">
import type { BlockquoteProps } from "#foundation/types/common/blockquote";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<BlockquoteProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <blockquote ref="el" class="f-blockquote">
    <slot>{{ label }}</slot>
  </blockquote>
</template>
