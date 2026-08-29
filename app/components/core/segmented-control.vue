<script lang="ts">
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
  SegmentedControlPassthrough,
  SegmentedControlContext,
  SegmentedControlSlots,
} from "../../types/core/segmented-control";
import type { ComponentPublicInstance } from "vue";

import { ToggleGroupRoot, ToggleGroupItem } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, options, disabled, required, pt } =
  defineProps<SegmentedControlProps>();

const emit = defineEmits<SegmentedControlEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<SegmentedControlPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      type: "single",
      disabled,
      "onUpdate:modelValue": (v) => {
        // Single-select vocabulary; prevent deselection when required.
        const val = Array.isArray(v) ? v[0] : v;
        if (required && !val) return;
        if (typeof val === "string") $model.value = val;
      },
    },
    item: (option) => ({
      value: option.value,
      disabled: option.disabled,
    }),
  },
}));

const ctx = useContext<SegmentedControlContext>("segmented-control", () => ({
  options,
  disabled,
  required,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<SegmentedControlSlots>();
</script>

<template>
  <ToggleGroupRoot ref="el" class="f-toggle-group-root" v-bind="settings.root">
    <template v-for="option in options" :key="option.value">
      <slot name="item" v-bind="{ ...ctx, option }">
        <ToggleGroupItem class="f-toggle-group-item" v-bind="settings.item(option)">
          <slot name="itemIcon" v-bind="{ ...ctx, option }">
            <Icon
              v-if="option.icon"
              class="f-icon"
              fill="currentColor"
              :name="option.icon"
            />
          </slot>
          <slot name="itemLabel" v-bind="{ ...ctx, option }">
            <span v-if="option.label" class="f-span">{{ option.label }}</span>
          </slot>
        </ToggleGroupItem>
      </slot>
    </template>
  </ToggleGroupRoot>
</template>
