<script lang="ts">
</script>

<script setup lang="ts">
import { useMagicKeys, whenever } from "@vueuse/core";
export interface ButtonProps {
  label?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  shortcut?: ButtonShortcut;
  tokens?: Tokens<"button">;
}

const {
  label,
  disabled,
  type = "button",
  shortcut,
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
</script>

<template>
  <button
    ref="button"
    :disabled="disabled"
    :type="type"
    :aria-label="label"
    :style="styles.button"
    class="f-button"
  >
    <slot name="prepend" />
    <slot>
      {{ label }}
    </slot>
    <slot name="append" />
  </button>
</template>

<style>
@import "#build/untheme/button.css";
</style>
