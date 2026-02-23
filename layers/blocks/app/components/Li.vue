<script setup lang="ts">
import type { LiProps } from "../types/li";

defineProps<LiProps>();

</script>

<template>
  <li class="f-li">
    <slot />
  </li>
</template>

