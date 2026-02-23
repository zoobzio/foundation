<script setup lang="ts">
import type { SectionProps } from "../types/section";

defineProps<SectionProps>();

</script>

<template>
  <section class="f-section">
    <slot />
  </section>
</template>

