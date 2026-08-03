<script lang="ts">
import type {
  ListboxProps,
  ListboxEmits,
  ListboxPassthrough,
  ListboxContext,
  ListboxSlots,
} from "#foundation/types/core/listbox";
import type { ComponentPublicInstance } from "vue";

import ListboxRoot from "#foundation/components/common/listbox/root.vue";
import ListboxContent from "#foundation/components/common/listbox/content.vue";
import ListboxItem from "#foundation/components/common/listbox/item.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  items,
  modelValue,
  multiple = false,
  disabled,
  pt,
} = defineProps<ListboxProps>();

const emit = defineEmits<ListboxEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<string | string[]>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const settings = usePassthrough<ListboxPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      multiple,
      disabled,
      "onUpdate:modelValue": (v) => {
        $model.value = Array.isArray(v)
          ? v.map((entry) => String(entry))
          : String(v);
      },
    },
    content: {},
    item: (option) => ({
      value: option.value,
      disabled: option.disabled,
    }),
  },
}));

const ctx = useContext<ListboxContext>("listbox", () => ({
  items,
  multiple,
  disabled,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<ListboxSlots>();
</script>

<template>
  <ListboxRoot ref="el" v-bind="settings.root">
    <slot name="content" v-bind="ctx">
      <ListboxContent v-bind="settings.content">
        <template v-for="option in items" :key="option.value">
          <slot name="item" v-bind="{ ...ctx, item: option }">
            <ListboxItem v-bind="settings.item(option)">
              {{ option.label }}
            </ListboxItem>
          </slot>
        </template>
      </ListboxContent>
    </slot>
  </ListboxRoot>
</template>
