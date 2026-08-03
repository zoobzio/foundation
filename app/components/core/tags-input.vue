<script lang="ts">
import type {
  TagsInputProps,
  TagsInputEmits,
  TagsInputPassthrough,
  TagsInputContext,
  TagsInputSlots,
} from "#foundation/types/core/tags-input";
import type { ComponentPublicInstance } from "vue";

import TagsInputRoot from "#foundation/components/common/tags-input/root.vue";
import TagsInputItem from "#foundation/components/common/tags-input/item.vue";
import TagsInputItemText from "#foundation/components/common/tags-input/item-text.vue";
import TagsInputItemDelete from "#foundation/components/common/tags-input/item-delete.vue";
import TagsInputInput from "#foundation/components/common/tags-input/input.vue";
import Icon from "#foundation/components/common/icon.vue";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  placeholder = "Add tags...",
  disabled,
  max,
  delimiter,
  pt,
} = defineProps<TagsInputProps>();

const emit = defineEmits<TagsInputEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<string[]>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { default: [] },
);

const tags = computed(() => $model.value ?? []);

const settings = usePassthrough<TagsInputPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      disabled,
      max,
      delimiter,
      "onUpdate:modelValue": (v) => {
        $model.value = v.map(String);
      },
    },
    item: (tag) => ({ value: tag }),
    itemText: {},
    itemDelete: {},
    itemDeleteIcon: { alias: "close" },
    input: { placeholder },
  },
}));

const ctx = useContext<TagsInputContext>("tags-input", () => ({
  placeholder,
  disabled,
  max,
  delimiter,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TagsInputSlots>();
</script>

<template>
  <TagsInputRoot ref="el" v-bind="settings.root">
    <template v-for="tag in tags" :key="tag">
      <slot name="item" v-bind="{ ...ctx, tag }">
        <TagsInputItem v-bind="settings.item(tag)">
          <slot name="itemText" v-bind="{ ...ctx, tag }">
            <TagsInputItemText v-bind="settings.itemText">
              {{ tag }}
            </TagsInputItemText>
          </slot>
          <slot name="itemDelete" v-bind="{ ...ctx, tag }">
            <TagsInputItemDelete v-bind="settings.itemDelete">
              <slot name="itemDeleteIcon" v-bind="{ ...ctx, tag }">
                <Icon v-bind="settings.itemDeleteIcon" />
              </slot>
            </TagsInputItemDelete>
          </slot>
        </TagsInputItem>
      </slot>
    </template>
    <slot name="input" v-bind="ctx">
      <TagsInputInput v-bind="settings.input" />
    </slot>
  </TagsInputRoot>
</template>
