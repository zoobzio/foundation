<script setup lang="ts">
import type { StrongProps } from "../types/strong";

defineProps<StrongProps>();

</script>

<template>
  <strong class="f-strong">
    <slot />
  </strong>
</template>

