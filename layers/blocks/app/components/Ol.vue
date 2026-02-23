<script setup lang="ts">
import type { OlProps } from "../types/ol";

defineProps<OlProps>();

</script>

<template>
  <ol class="f-ol">
    <slot />
  </ol>
</template>

