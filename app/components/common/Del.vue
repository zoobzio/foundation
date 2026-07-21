<script lang="ts">
import type { DelProps } from "#foundation/types/common/del";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<DelProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <del ref="el" class="f-del">
    <slot>{{ label }}</slot>
  </del>
</template>
