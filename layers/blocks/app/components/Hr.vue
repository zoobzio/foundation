<script setup lang="ts">
import type { HrProps } from "../types/hr";

const { tokens } = defineProps<HrProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <hr :style="styles.hr" class="f-hr" >
</template>

<style>
@import '#build/untheme/hr.css';
</style>
