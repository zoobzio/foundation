<script setup lang="ts">
import type { CheckboxProps } from "../types/checkbox";

const { disabled, name, value, required } = defineProps<CheckboxProps>();

const model = defineModel<boolean | "indeterminate">();
</script>

<template>
  <CheckboxRoot
    v-model="model"
    :disabled="disabled"
    :name="name"
    :value="value"
    :required="required"
    class="f-checkbox-root"
  >
    <span class="f-checkbox-indicator">
      <slot>
        <Icon :alias="model === 'indeterminate' ? 'minus' : 'check'" />
      </slot>
    </span>
  </CheckboxRoot>
</template>

