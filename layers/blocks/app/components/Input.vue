<script setup lang="ts">
import type { InputProps } from "../types/input";

const {
  type = "text",
  placeholder,
  disabled,
  required,
  name,
  tokens,
} = defineProps<InputProps>();

const model = defineModel<string>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :name="name"
    :style="styles.input"
    class="f-input"
  >
</template>

<style>
@import '#build/untheme/input.css';
</style>
