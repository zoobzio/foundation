<script setup lang="ts">
import type { CheckboxProps } from "../types/checkbox";

const { disabled, name, value, required, tokens } = defineProps<CheckboxProps>();

const model = defineModel<boolean | "indeterminate">();

const styles = useTokenStyle(tokens);
</script>

<template>
  <CheckboxRoot
    v-model="model"
    :disabled="disabled"
    :name="name"
    :value="value"
    :required="required"
    :style="styles['checkbox-root']"
    class="f-checkbox-root"
  >
    <CheckboxIndicator
      :style="styles['checkbox-indicator']"
      class="f-checkbox-indicator"
    >
      <slot>
        <Icon alias="check" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<style>
@import '#build/untheme/checkbox-root.css';
@import '#build/untheme/checkbox-indicator.css';
</style>
