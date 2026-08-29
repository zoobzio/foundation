<script lang="ts">
import type {
  TagsInputProps,
  TagsInputEmits,
  TagsInputPassthrough,
  TagsInputContext,
  TagsInputSlots,
} from "../../types/core/tags-input";
import type { ComponentPublicInstance } from "vue";

import {
  TagsInputRoot,
  TagsInputItem,
  TagsInputItemText,
  TagsInputItemDelete,
  TagsInputInput,
} from "reka-ui";

import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
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
  <TagsInputRoot ref="el" class="f-tags-input-root" v-bind="settings.root">
    <template v-for="tag in tags" :key="tag">
      <slot name="item" v-bind="{ ...ctx, tag }">
        <TagsInputItem class="f-tags-input-item" v-bind="settings.item(tag)">
          <slot name="itemText" v-bind="{ ...ctx, tag }">
            <TagsInputItemText
              class="f-tags-input-item-text"
              v-bind="settings.itemText"
            >
              {{ tag }}
            </TagsInputItemText>
          </slot>
          <slot name="itemDelete" v-bind="{ ...ctx, tag }">
            <TagsInputItemDelete
              class="f-tags-input-item-delete"
              v-bind="settings.itemDelete"
            >
              <slot name="itemDeleteIcon" v-bind="{ ...ctx, tag }">
                <Icon class="f-icon" fill="currentColor" name="close" />
              </slot>
            </TagsInputItemDelete>
          </slot>
        </TagsInputItem>
      </slot>
    </template>
    <slot name="input" v-bind="ctx">
      <TagsInputInput class="f-tags-input-input" v-bind="settings.input" />
    </slot>
  </TagsInputRoot>
</template>
