<script setup lang="ts">
import type { IconProps } from "../types/icon";

const { alias, tokens } = defineProps<IconProps>();

const icon = computed(() => useIconAlias(alias));

const tokenStyles = useTokenStyle(tokens);

const iconStyle = computed(() => {
  const base = tokenStyles.value.icon ?? {};
  const { uri, mode } = icon.value;

  if (mode === "mask") {
    return {
      ...base,
      maskImage: `url("${uri}")`,
      maskRepeat: "no-repeat",
      maskPosition: "center",
      maskSize: "contain",
      WebkitMaskImage: `url("${uri}")`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      WebkitMaskSize: "contain",
      backgroundColor: "currentColor",
    };
  }

  return {
    ...base,
    backgroundImage: `url("${uri}")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
  };
});
</script>

<template>
  <i class="f-icon" :style="iconStyle" />
</template>

<style>
@import '#build/untheme/icon.css';
</style>
