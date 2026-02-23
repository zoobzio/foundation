<script setup lang="ts">
import type { H4Props } from "../types/h4";

defineProps<H4Props>();

</script>

<template>
  <h4 class="f-h4">
    <slot />
  </h4>
</template>

