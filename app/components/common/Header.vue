<script lang="ts">
import type { HeaderProps } from "#foundation/types/common/header";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<HeaderProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <header ref="el" :aria-label="label" class="f-header">
    <slot>{{ label }}</slot>
  </header>
</template>
