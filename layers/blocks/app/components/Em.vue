<script setup lang="ts">
import type { EmProps } from "../types/em";

defineProps<EmProps>();

</script>

<template>
  <em class="f-em">
    <slot />
  </em>
</template>

