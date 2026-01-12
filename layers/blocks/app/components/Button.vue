<script setup lang="ts">
import type { ButtonProps } from "../types/button";

const {
  label,
  disabled,
  type = "button",
  shortcut,
  link,
  tokens,
} = defineProps<ButtonProps>();

const styles = useTokenStyle(tokens);

const buttonRef = useTemplateRef<HTMLButtonElement>("button");

if (shortcut) {
  const keys = useMagicKeys();
  const combo = computed(() => keys[`meta+${shortcut}`]?.value);

  whenever(combo, () => {
    buttonRef.value?.click();
  });
}

const NuxtLink = defineNuxtLink({});

const buttonProps = computed(() => ({
  type,
  disabled,
}));

const linkProps = computed(() => ({
  ...link,
  disabled,
}));
</script>

<template>
  <Primitive
    ref="button"
    :as="link ? NuxtLink : 'button'"
    :aria-label="label"
    :style="styles.button"
    v-bind="link ? linkProps : buttonProps"
    class="f-button"
  >
    <slot name="prepend" />
    <slot>
      {{ label }}
    </slot>
    <slot name="append" />
  </Primitive>
</template>

<style>
@import "#build/untheme/button.css";
</style>
