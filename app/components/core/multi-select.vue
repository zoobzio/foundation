<script lang="ts">
import type {
  MultiSelectProps,
  MultiSelectEmits,
  MultiSelectPassthrough,
  MultiSelectContext,
  MultiSelectSlots,
} from "../../types/core/multi-select";
import type { Option } from "../../types/core/common";
import type { ComponentPublicInstance } from "vue";

import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectContent,
  SelectItem,
  SelectItemText,
} from "reka-ui";
import Checkbox from "./checkbox.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { useSelection } from "../../composables/selection";
import { SELECT_SIDE_OFFSET } from "../../constants/select";
</script>

<script setup lang="ts" generic="T extends Option">
const {
  modelValue,
  open = undefined,
  items,
  placeholder = "Select options",
  disabled,
  pt,
} = defineProps<MultiSelectProps<T>>();

const emit = defineEmits<MultiSelectEmits<T>>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const { display, selected } = useSelection($model, () => ({
  placeholder,
  multiple: true,
}));

const settings = usePassthrough<MultiSelectPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value?.map((o) => o.value),
      multiple: true,
      open: $open.value,
      disabled,
      "onUpdate:modelValue": (v) => {
        const keys = Array.isArray(v) ? v : [v];
        $model.value = items.filter((o) => keys.includes(o.value));
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: {},
    content: { position: "popper", sideOffset: SELECT_SIDE_OFFSET },
    item: (option) => ({
      value: option.value,
      textValue: option.label,
      disabled: option.disabled,
    }),
    itemCheckbox: (option) => ({
      modelValue: selected(option),
      disabled: option.disabled,
    }),
    itemText: {},
  },
}));

const ctx = useContext<MultiSelectContext<T>>("multiSelect", () => ({
  items,
  placeholder,
  disabled,
  modelValue: $model,
  open: $open,
  display: display.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<MultiSelectSlots<T>>();
</script>

<template>
  <SelectRoot ref="el" class="f-select-root" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <SelectTrigger class="f-select-trigger" v-bind="settings.trigger">
        <slot name="triggerLabel" v-bind="ctx">
          <span class="f-span">
            {{ display }}
          </span>
        </slot>
        <slot name="triggerIcon" v-bind="ctx">
          <Icon
            class="f-icon"
            fill="currentColor"
            :name="$open ? 'chevron-up' : 'chevron-down'"
          />
        </slot>
      </SelectTrigger>
    </slot>
    <SelectPortal>
      <slot name="content" v-bind="ctx">
        <SelectContent class="f-select-content" v-bind="settings.content">
          <template v-for="item in items" :key="item.value">
            <slot
              name="item"
              v-bind="{ ...ctx, item, selected: selected(item) }"
            >
              <SelectItem class="f-select-item" v-bind="settings.item(item)">
                <slot
                  name="itemCheckbox"
                  v-bind="{ ...ctx, item, selected: selected(item) }"
                >
                  <Checkbox v-bind="settings.itemCheckbox(item)" />
                </slot>
                <slot name="itemText" v-bind="{ ...ctx, item }">
                  <SelectItemText
                    class="f-select-item-text"
                    v-bind="settings.itemText"
                  >
                    {{ item.label }}
                  </SelectItemText>
                </slot>
              </SelectItem>
            </slot>
          </template>
        </SelectContent>
      </slot>
    </SelectPortal>
  </SelectRoot>
</template>
