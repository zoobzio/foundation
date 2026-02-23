<script setup lang="ts">
import type { CodeProps } from "../types/code";

defineProps<CodeProps>();

</script>

<template>
  <code class="f-code">
    <slot />
  </code>
</template>

