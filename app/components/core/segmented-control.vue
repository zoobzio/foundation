<script lang="ts">
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
  SegmentedControlPassthrough,
  SegmentedControlContext,
  SegmentedControlSlots,
} from "../../types/core/segmented-control";
import type { ComponentPublicInstance } from "vue";

import ToggleGroupRoot from "../common/toggle-group/root.vue";
import ToggleGroupItem from "../common/toggle-group/item.vue";
import Icon from "../common/icon.vue";
import Span from "../common/span.vue";

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
    itemIcon: (option) => ({
      alias: option.icon ?? "",
    }),
    itemLabel: {},
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
  <ToggleGroupRoot ref="el" v-bind="settings.root">
    <template v-for="option in options" :key="option.value">
      <slot name="item" v-bind="{ ...ctx, option }">
        <ToggleGroupItem v-bind="settings.item(option)">
          <slot name="itemIcon" v-bind="{ ...ctx, option }">
            <Icon v-if="option.icon" v-bind="settings.itemIcon(option)" />
          </slot>
          <slot name="itemLabel" v-bind="{ ...ctx, option }">
            <Span v-if="option.label" v-bind="settings.itemLabel">{{
              option.label
            }}</Span>
          </slot>
        </ToggleGroupItem>
      </slot>
    </template>
  </ToggleGroupRoot>
</template>
