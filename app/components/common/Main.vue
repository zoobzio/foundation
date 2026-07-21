<script lang="ts">
import type { MainProps } from "#foundation/types/common/main";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<MainProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <main ref="el" :aria-label="label" class="f-main">
    <slot>{{ label }}</slot>
  </main>
</template>
