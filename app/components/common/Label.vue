<script lang="ts">
import type { LabelProps } from "#foundation/types/common/label";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { for: htmlFor } = defineProps<LabelProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <label ref="el" :for="htmlFor" class="f-label">
    <slot />
  </label>
</template>
