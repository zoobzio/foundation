<script lang="ts">
import type { FooterProps } from "#foundation/types/common/footer";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<FooterProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <footer ref="el" :aria-label="label" class="f-footer">
    <slot>{{ label }}</slot>
  </footer>
</template>
