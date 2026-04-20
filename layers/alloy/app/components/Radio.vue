<script lang="ts">
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from "reka-ui";
import type { RadioProps } from "../types/radio";
</script>

<script setup lang="ts">
const {
  options,
  disabled,
  required,
  name,
  orientation = "vertical",
  pt,
} = defineProps<RadioProps>();

const model = defineModel<string>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ options, disabled, required, name, orientation, model: model.value }));
</script>

<template>
  <RadioGroupRoot
    ref="el"
    v-model="model"
    :disabled="disabled"
    :required="required"
    :name="name"
    :orientation="orientation"
    v-bind="pt?.root"
    class="f-radio-root"
  >
    <template v-for="option in options" :key="option.value">
      <slot name="option" v-bind="{ ...ctx, option }">
        <Label
          v-bind="pt?.option"
          class="f-radio-option"
        >
          <RadioGroupItem
            :value="option.value"
            :disabled="option.disabled"
            v-bind="pt?.item"
            class="f-radio-item"
          >
            <slot name="indicator" v-bind="{ ...ctx, option }">
              <RadioGroupIndicator v-bind="pt?.indicator" class="f-radio-indicator" />
            </slot>
          </RadioGroupItem>
          <Span class="f-radio-label">{{ option.label }}</Span>
        </Label>
      </slot>
    </template>
  </RadioGroupRoot>
</template>
