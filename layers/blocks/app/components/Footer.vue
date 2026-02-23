<script setup lang="ts">
import type { FooterProps } from "../types/footer";

defineProps<FooterProps>();

</script>

<template>
  <footer class="f-footer">
    <slot />
  </footer>
</template>

