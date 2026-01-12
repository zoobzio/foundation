<script setup lang="ts">
import type { TbodyProps } from "../types/tbody";

const { tokens } = defineProps<TbodyProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <tbody :style="styles.tbody" class="f-tbody">
    <slot />
  </tbody>
</template>

<style>
@import '#build/untheme/tbody.css';
</style>
