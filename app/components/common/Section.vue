<script lang="ts">
import type { SectionProps } from "#foundation/types/common/section";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<SectionProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <section ref="el" :aria-label="label" class="f-section">
    <slot>{{ label }}</slot>
  </section>
</template>
