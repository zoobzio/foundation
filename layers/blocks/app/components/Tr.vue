<script setup lang="ts">
import type { TrProps } from "../types/tr";

defineProps<TrProps>();

</script>

<template>
  <tr class="f-tr">
    <slot />
  </tr>
</template>

