<script lang="ts">
import type { LiProps } from "#foundation/types/common/li";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<LiProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <li ref="el" class="f-li">
    <slot>{{ label }}</slot>
  </li>
</template>
