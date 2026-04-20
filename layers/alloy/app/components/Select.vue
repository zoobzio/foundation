<script lang="ts">
import { SelectRoot, SelectTrigger, SelectPortal, SelectContent, SelectItem, SelectItemText } from "reka-ui";
import type { SelectProps } from "../types/select";
</script>

<script setup lang="ts">
const {
  options,
  placeholder = "Select an option",
  disabled,
  required,
  name,
  pt,
} = defineProps<SelectProps>();

const model = defineModel<string>();

const el = useTemplateRef("el");
defineExpose({ el });

const displayText = computed(() => {
  const selected = options.find((o) => o.value === model.value);
  return selected?.label ?? placeholder;
});

const ctx = computed(() => ({ options, placeholder, disabled, required, name, model: model.value, displayText: displayText.value }));
</script>

<template>
  <SelectRoot
    ref="el"
    v-model="model"
    :disabled="disabled"
    :required="required"
    :name="name"
    v-bind="pt?.root"
    class="f-select-root"
  >
    <slot name="trigger" v-bind="ctx">
      <SelectTrigger
        v-bind="pt?.trigger"
        class="f-select-trigger"
      >
        <Span>{{ displayText }}</Span>
        <Icon alias="chevron-down" />
      </SelectTrigger>
    </slot>
    <SelectPortal>
      <SelectContent
        v-bind="pt?.content"
        class="f-select-content"
        position="popper"
        :side-offset="4"
      >
      <template v-for="option in options" :key="option.value">
        <slot name="item" v-bind="{ ...ctx, option }">
          <SelectItem
            :value="option.value"
            :disabled="option.disabled"
            v-bind="pt?.item"
            class="f-select-item"
          >
            <SelectItemText v-bind="pt?.itemText">{{ option.label }}</SelectItemText>
          </SelectItem>
        </slot>
      </template>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

