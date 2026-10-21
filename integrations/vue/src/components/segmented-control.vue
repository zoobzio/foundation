<script lang="ts">
/**
 * A single-select toggle group. When `required` is set, the active
 * option cannot deselect. An option with a `link` renders as an anchor.
 */
import type {
  SegmentedControlProps,
  SegmentedControlEmits,
  SegmentedControlPassthrough,
  SegmentedControlContext,
  SegmentedControlSlots,
  SegmentedControlOption,
} from "../types/core/segmented-control";
import type { ComponentPublicInstance } from "vue";

import { ToggleGroupRoot, ToggleGroupItem } from "reka-ui";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useModel } from "../composables/model";
import { useContext } from "../composables/context";
</script>

<script setup lang="ts" generic="T extends SegmentedControlOption">
const { modelValue, options, disabled, required, pt } =
  defineProps<SegmentedControlProps<T>>();

const emit = defineEmits<SegmentedControlEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<SegmentedControlPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      type: "single",
      disabled,
      "onUpdate:modelValue": (v) => {
        const val = Array.isArray(v) ? v[0] : v;
        if (required && !val) return;
        if (typeof val === "string") $model.value = val;
      },
    },
    item: (option) => ({
      value: option.value,
      disabled: option.disabled,
      // `as: "a"` keeps reka from adding `type="button"` to the anchor.
      asChild: !!option.link,
      as: option.link ? "a" : undefined,
    }),
  },
}));

const ctx = useContext<SegmentedControlContext<T>>("segmented-control", () => ({
  options,
  disabled,
  required,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<SegmentedControlSlots<T>>();
</script>

<template>
  <ToggleGroupRoot ref="el" class="f-toggle-group-root" v-bind="settings.root">
    <template v-for="option in options" :key="option.value">
      <slot name="item" v-bind="{ ...ctx, option }">
        <ToggleGroupItem
          class="f-toggle-group-item"
          v-bind="settings.item(option)"
        >
          <a
            v-if="option.link"
            :href="option.disabled ? undefined : option.link.to"
            :target="option.link.target"
          >
            <slot name="itemIcon" v-bind="{ ...ctx, option }" />
            <slot name="itemLabel" v-bind="{ ...ctx, option }">
              <span v-if="option.label" class="f-span">{{ option.label }}</span>
            </slot>
          </a>
          <template v-else>
            <slot name="itemIcon" v-bind="{ ...ctx, option }" />
            <slot name="itemLabel" v-bind="{ ...ctx, option }">
              <span v-if="option.label" class="f-span">{{ option.label }}</span>
            </slot>
          </template>
        </ToggleGroupItem>
      </slot>
    </template>
  </ToggleGroupRoot>
</template>
