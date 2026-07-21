<script lang="ts">
import type { OlProps } from "#foundation/types/common/ol";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<OlProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <ol ref="el" class="f-ol">
    <slot />
  </ol>
</template>
