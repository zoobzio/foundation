<script lang="ts">
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput } from "reka-ui";
import type { TagsInputProps } from "../types/tags-input";
</script>

<script setup lang="ts">
const {
  placeholder = "Add tags...",
  disabled,
  required,
  name,
  max,
  addOnBlur = true,
  addOnPaste = true,
  addOnTab = true,
  delimiter = ",",
  duplicate = false,
  pt,
} = defineProps<TagsInputProps>();

const model = defineModel<string[]>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ placeholder, disabled, required, name, max, model: model.value }));
</script>

<template>
  <TagsInputRoot
    ref="el"
    v-model="model"
    :disabled="disabled"
    :required="required"
    :name="name"
    :max="max"
    :add-on-blur="addOnBlur"
    :add-on-paste="addOnPaste"
    :add-on-tab="addOnTab"
    :delimiter="delimiter"
    :duplicate="duplicate"
    v-bind="pt?.root"
    class="f-tags-input-root"
  >
    <template v-for="tag in model" :key="tag">
      <slot name="item" v-bind="{ ...ctx, tag }">
        <TagsInputItem
          :value="tag"
          v-bind="pt?.item"
          class="f-tags-input-item"
        >
          <TagsInputItemText
            v-bind="pt?.itemText"
            class="f-tags-input-item-text"
          />
          <TagsInputItemDelete
            v-bind="pt?.itemDelete"
            class="f-tags-input-item-delete"
          >
            <Icon alias="close" />
          </TagsInputItemDelete>
        </TagsInputItem>
      </slot>
    </template>
    <slot name="input" v-bind="ctx">
      <TagsInputInput
        :placeholder="placeholder"
        v-bind="pt?.input"
        class="f-tags-input-input"
      />
    </slot>
  </TagsInputRoot>
</template>

