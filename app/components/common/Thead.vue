<script lang="ts">
import type { TheadProps } from "#foundation/types/common/thead";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<TheadProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <thead ref="el" class="f-thead">
    <slot />
  </thead>
</template>
