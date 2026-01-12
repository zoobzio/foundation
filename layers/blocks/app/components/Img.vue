<script setup lang="ts">
import type { ImgProps } from "../types/img";

const { src, alt, tokens } = defineProps<ImgProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <img :src="src" :alt="alt" :style="styles.img" class="f-img" >
</template>

<style>
@import '#build/untheme/img.css';
</style>
