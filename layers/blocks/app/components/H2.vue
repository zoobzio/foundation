<script setup lang="ts">
import type { H2Props } from "../types/h2";

defineProps<H2Props>();

</script>

<template>
  <h2 class="f-h2">
    <slot />
  </h2>
</template>

