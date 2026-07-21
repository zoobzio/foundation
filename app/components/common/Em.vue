<script lang="ts">
import type { EmProps } from "#foundation/types/common/em";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<EmProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <em ref="el" class="f-em">
    <slot>{{ label }}</slot>
  </em>
</template>
