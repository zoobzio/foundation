<script lang="ts">
import type { KbdProps } from "#foundation/types/common/kbd";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<KbdProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <kbd ref="el" class="f-kbd">
    <slot>{{ label }}</slot>
  </kbd>
</template>
