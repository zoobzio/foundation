<script lang="ts">
import type {
  SelectProps,
  SelectEmits,
  SelectPassthrough,
  SelectContext,
  SelectSlots,
} from "../../types/core/select";
import type { Option } from "../../types/core/common";
import type { ComponentPublicInstance } from "vue";

import SelectRoot from "../common/select/root.vue";
import SelectTrigger from "../common/select/trigger.vue";
import SelectPortal from "../common/select/portal.vue";
import SelectContent from "../common/select/content.vue";
import SelectItem from "../common/select/item.vue";
import SelectItemText from "../common/select/item-text.vue";
import Icon from "../common/icon.vue";
import Span from "../common/span.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
import { SELECT_SIDE_OFFSET } from "../../constants/select";
import { useSelection } from "../../composables/selection";
</script>

<script setup lang="ts" generic="T extends Option">
const {
  modelValue,
  open = undefined,
  options,
  placeholder = "Select an option",
  disabled,
  required,
  name,
  pt,
} = defineProps<SelectProps<T>>();

const emit = defineEmits<SelectEmits<T>>();

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

const { display } = useSelection($model, () => ({
  placeholder,
}));

const settings = usePassthrough<SelectPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value?.value,
      open: $open.value,
      disabled,
      required,
      name,
      "onUpdate:modelValue": (v) => {
        const target = options.find((o) => o.value === v);
        if (target) $model.value = target;
      },
      "onUpdate:open": (v) => {
        $open.value = v;
      },
    },
    trigger: {},
    content: { position: "popper", sideOffset: SELECT_SIDE_OFFSET },
    triggerLabel: {},
    triggerIcon: {
      alias: $open.value ? "chevron-up" : "chevron-down",
    },
    itemText: {},
    item: (obj) => ({
      value: obj.value,
      textValue: obj.label,
      disabled: obj.disabled,
    }),
  },
}));

const ctx = useContext<SelectContext<T>>("select", () => ({
  options,
  placeholder,
  disabled,
  required,
  name,
  modelValue: $model,
  open: $open,
  display: display.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<SelectSlots<T>>();
</script>

<template>
  <SelectRoot ref="el" v-bind="settings.root">
    <slot name="trigger" v-bind="ctx">
      <SelectTrigger v-bind="settings.trigger">
        <slot name="triggerLabel" v-bind="ctx">
          <Span v-bind="settings.triggerLabel">
            {{ display }}
          </Span>
        </slot>
        <slot name="triggerIcon" v-bind="ctx">
          <Icon v-bind="settings.triggerIcon" />
        </slot>
      </SelectTrigger>
    </slot>
    <SelectPortal>
      <slot name="content" v-bind="ctx">
        <SelectContent v-bind="settings.content">
          <template v-for="option in options" :key="option.value">
            <slot name="item" v-bind="{ ...ctx, option }">
              <SelectItem v-bind="settings.item(option)">
                <slot name="itemText" v-bind="{ ...ctx, option }">
                  <SelectItemText v-bind="settings.itemText">
                    {{ option.label }}
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
