<script setup lang="ts">
import type { AvatarProps } from "../types/avatar";

const { src, alt, fallback, tokens } = defineProps<AvatarProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <AvatarRoot :style="styles['avatar-root']" class="f-avatar-root">
    <AvatarImage
      :src="src"
      :alt="alt"
      :style="styles['avatar-image']"
      class="f-avatar-image"
    />
    <AvatarFallback
      :style="styles['avatar-fallback']"
      class="f-avatar-fallback"
    >
      <slot name="fallback">
        {{ fallback }}
      </slot>
    </AvatarFallback>
  </AvatarRoot>
</template>

<style>
@import '#build/untheme/avatar-root.css';
@import '#build/untheme/avatar-image.css';
@import '#build/untheme/avatar-fallback.css';
</style>
