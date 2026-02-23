<script setup lang="ts">
import type { CardProps } from "../types/card";

defineProps<CardProps>();

</script>

<template>
  <div class="f-card">
    <slot />
  </div>
</template>

