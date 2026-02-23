<script setup lang="ts">
import type { SelectProps } from "../types/select";

const {
  options,
  placeholder = "Select an option",
  disabled,
  required,
  name,
} = defineProps<SelectProps>();

const model = defineModel<string>();

const displayText = computed(() => {
  const selected = options.find((o) => o.value === model.value);
  return selected?.label ?? placeholder;
});
</script>

<template>
  <SelectRoot
    v-model="model"
    :disabled="disabled"
    :required="required"
    :name="name"
    class="f-select-root"
  >
    <SelectTrigger
      class="f-select-trigger"
    >
      <span>{{ displayText }}</span>
      <Icon alias="chevron-down" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="f-select-content"
        position="popper"
        :side-offset="4"
      >
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
        class="f-select-item"
      >
        <SelectItemText>{{ option.label }}</SelectItemText>
      </SelectItem>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

