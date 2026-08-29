<script lang="ts">
import type {
  RadioProps,
  RadioEmits,
  RadioPassthrough,
  RadioContext,
  RadioSlots,
} from "../../types/core/radio";
import type { ComponentPublicInstance } from "vue";

import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from "reka-ui";

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
    item: (option) => ({
      value: option.value,
      disabled: option.disabled,
    }),
    indicator: {},
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
  <RadioGroupRoot ref="el" class="f-radio-group-root" v-bind="settings.root">
    <template v-for="option in options" :key="option.value">
      <slot name="option" v-bind="{ ...ctx, option }">
        <label class="f-label">
          <RadioGroupItem class="f-radio-group-item" v-bind="settings.item(option)">
            <slot name="indicator" v-bind="{ ...ctx, option }">
              <RadioGroupIndicator
                class="f-radio-group-indicator"
                v-bind="settings.indicator"
              />
            </slot>
          </RadioGroupItem>
          <slot name="optionLabel" v-bind="{ ...ctx, option }">
            <span class="f-span">{{ option.label }}</span>
          </slot>
        </label>
      </slot>
    </template>
  </RadioGroupRoot>
</template>
