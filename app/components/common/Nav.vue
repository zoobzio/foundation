<script lang="ts">
import type { NavProps } from "#foundation/types/common/nav";
import { useTemplateRef } from "#imports";
</script>

<script setup lang="ts">
const { label } = defineProps<NavProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <nav ref="el" :aria-label="label" class="f-nav">
    <slot>{{ label }}</slot>
  </nav>
</template>
