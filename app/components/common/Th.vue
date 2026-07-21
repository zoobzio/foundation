<script lang="ts">
import type { ThProps } from "#foundation/types/common/th";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { scope } = defineProps<ThProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <th ref="el" :scope="scope" class="f-th">
    <slot />
  </th>
</template>
