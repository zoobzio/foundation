<script lang="ts">
import type { PProps } from "#foundation/types/common/p";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<PProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <p ref="el" class="f-p">
    <slot>{{ label }}</slot>
  </p>
</template>
