<script setup lang="ts">
import type { AnchorProps } from "../types/anchor";

const { label, to, external, target, replace, prefetch, disabled, tokens } =
  defineProps<AnchorProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <NuxtLink
    :to="disabled ? undefined : to"
    :external="external"
    :target="target"
    :replace="replace"
    :prefetch="prefetch"
    :style="styles.a"
    :aria-disabled="disabled"
    :aria-current="disabled ? 'page' : undefined"
    class="f-a"
  >
    <slot>
      {{ label }}
    </slot>
  </NuxtLink>
</template>

<style>
@import "#build/untheme/a.css";
</style>
