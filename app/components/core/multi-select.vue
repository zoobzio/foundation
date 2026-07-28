<script lang="ts">
import type {
  MultiSelectProps,
  MultiSelectEmits,
  MultiSelectPassthrough,
  MultiSelectContext,
  MultiSelectSlots,
} from "#foundation/types/core/multi-select";
import type { Option } from "#foundation/types/core/common";
import type { ComponentPublicInstance } from "vue";

import SelectRoot from "#foundation/components/common/select/root.vue";
import SelectTrigger from "#foundation/components/common/select/trigger.vue";
import SelectPortal from "#foundation/components/common/select/portal.vue";
import SelectContent from "#foundation/components/common/select/content.vue";
import SelectItem from "#foundation/components/common/select/item.vue";
import SelectItemText from "#foundation/components/common/select/item-text.vue";
import Icon from "#foundation/components/common/icon.vue";
import Span from "#foundation/components/common/span.vue";
import Checkbox from "#foundation/components/core/checkbox.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
import { useSelection } from "#foundation/composables/selection";
import { SELECT_SIDE_OFFSET } from "#foundation/constants/select";
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
    triggerLabel: {},
    triggerIcon: {
      alias: $open.value ? "chevron-up" : "chevron-down",
    },
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
          <template v-for="item in items" :key="item.value">
            <slot
              name="item"
              v-bind="{ ...ctx, item, selected: selected(item) }"
            >
              <SelectItem v-bind="settings.item(item)">
                <slot
                  name="itemCheckbox"
                  v-bind="{ ...ctx, item, selected: selected(item) }"
                >
                  <Checkbox v-bind="settings.itemCheckbox(item)" />
                </slot>
                <slot name="itemText" v-bind="{ ...ctx, item }">
                  <SelectItemText v-bind="settings.itemText">
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
