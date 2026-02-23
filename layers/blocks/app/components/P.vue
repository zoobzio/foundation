<script setup lang="ts">
import type { PProps } from "../types/p";

defineProps<PProps>();

</script>

<template>
  <p class="f-p">
    <slot />
  </p>
</template>

