<script lang="ts">
import type { UlProps } from "#foundation/types/common/ul";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
defineProps<UlProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <ul ref="el" class="f-ul">
    <slot />
  </ul>
</template>
