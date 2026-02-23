<script setup lang="ts">
import type { RadioProps } from "../types/radio";

const {
  options,
  disabled,
  required,
  name,
  orientation = "vertical",
} = defineProps<RadioProps>();

const model = defineModel<string>();
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :required="required"
    :name="name"
    :orientation="orientation"
    class="f-radio-root"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="f-radio-option"
    >
      <RadioGroupItem
        :value="option.value"
        :disabled="option.disabled"
        class="f-radio-item"
      >
        <RadioGroupIndicator class="f-radio-indicator" />
      </RadioGroupItem>
      <span class="f-radio-label">{{ option.label }}</span>
    </label>
  </RadioGroupRoot>
</template>
