<script setup lang="ts">
import type { NavProps } from "../types/nav";

defineProps<NavProps>();

</script>

<template>
  <nav class="f-nav">
    <slot />
  </nav>
</template>

