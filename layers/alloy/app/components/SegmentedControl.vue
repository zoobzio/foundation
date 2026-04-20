<script lang="ts">
import type { SegmentedControlProps } from "../types/segmented-control";
import type { AcceptableValue } from "reka-ui";
import {
  ToggleGroupRoot,
  ToggleGroupItem,
} from "reka-ui";
</script>

<script setup lang="ts">
const {
  pt,
  options,
  disabled,
  required,
} = defineProps<SegmentedControlProps>();

const model = defineModel<string>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({
  options,
  disabled,
  required,
  model: model.value,
}));

// Prevent deselection when required
const handleUpdate = (value: AcceptableValue | AcceptableValue[]) => {
  const val = Array.isArray(value) ? value[0] : value;
  if (required && !val) return;
  if (typeof val === "string") model.value = val;
};
</script>

<template>
  <ToggleGroupRoot
    ref="el"
    :model-value="model"
    type="single"
    :disabled="disabled"
    v-bind="pt?.root"
    class="f-segmented-control"
    @update:model-value="handleUpdate"
  >
    <slot v-for="option in options" name="item" v-bind="{ ...ctx, option }">
      <ToggleGroupItem
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
        v-bind="pt?.item"
        class="f-segmented-control-item"
      >
        <Icon v-if="option.icon" :alias="option.icon" />
        <Span v-if="option.label">{{ option.label }}</Span>
      </ToggleGroupItem>
    </slot>
  </ToggleGroupRoot>
</template>
