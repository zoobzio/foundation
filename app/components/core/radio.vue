<script lang="ts">
import type {
  RadioProps,
  RadioEmits,
  RadioPassthrough,
  RadioContext,
  RadioSlots,
} from "../../types/core/radio";
import type { ComponentPublicInstance } from "vue";

import RadioGroupRoot from "../common/radio-group/root.vue";
import RadioGroupItem from "../common/radio-group/item.vue";
import RadioGroupIndicator from "../common/radio-group/indicator.vue";
import Label from "../common/label.vue";
import Span from "../common/span.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  options,
  disabled,
  required,
  name,
  orientation = "vertical",
  pt,
} = defineProps<RadioProps>();

const emit = defineEmits<RadioEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<RadioPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      disabled,
      required,
      name,
      orientation,
      "onUpdate:modelValue": (v) => {
        $model.value = String(v);
      },
    },
    option: {},
    item: (option) => ({
      value: option.value,
      disabled: option.disabled,
    }),
    indicator: {},
    optionLabel: {},
  },
}));

const ctx = useContext<RadioContext>("radio", () => ({
  options,
  disabled,
  required,
  name,
  orientation,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<RadioSlots>();
</script>

<template>
  <RadioGroupRoot ref="el" v-bind="settings.root">
    <template v-for="option in options" :key="option.value">
      <slot name="option" v-bind="{ ...ctx, option }">
        <Label v-bind="settings.option">
          <RadioGroupItem v-bind="settings.item(option)">
            <slot name="indicator" v-bind="{ ...ctx, option }">
              <RadioGroupIndicator v-bind="settings.indicator" />
            </slot>
          </RadioGroupItem>
          <slot name="optionLabel" v-bind="{ ...ctx, option }">
            <Span v-bind="settings.optionLabel">{{ option.label }}</Span>
          </slot>
        </Label>
      </slot>
    </template>
  </RadioGroupRoot>
</template>
