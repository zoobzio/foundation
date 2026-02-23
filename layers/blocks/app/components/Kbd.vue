<script setup lang="ts">
import type { KbdProps } from "../types/kbd";

defineProps<KbdProps>();

</script>

<template>
  <kbd class="f-kbd">
    <slot />
  </kbd>
</template>

