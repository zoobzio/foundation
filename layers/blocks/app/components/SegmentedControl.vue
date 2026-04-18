<script setup lang="ts">
import type { SegmentedControlProps } from "../types/segmented-control";
import type { AcceptableValue } from "reka-ui";
import {
  ToggleGroupRoot,
  ToggleGroupItem,
} from "reka-ui";

const {
  options,
  disabled,
  required,
} = defineProps<SegmentedControlProps>();

const model = defineModel<string>();

// Prevent deselection when required
const handleUpdate = (value: AcceptableValue | AcceptableValue[]) => {
  const val = Array.isArray(value) ? value[0] : value;
  if (required && !val) return;
  if (typeof val === "string") model.value = val;
};
</script>

<template>
  <ToggleGroupRoot
    :model-value="model"
    type="single"
    :disabled="disabled"
    class="f-segmented-control"
    @update:model-value="handleUpdate"
  >
    <ToggleGroupItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
      class="f-segmented-control-item"
    >
      <Icon v-if="option.icon" :alias="option.icon" />
      <span v-if="option.label">{{ option.label }}</span>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
