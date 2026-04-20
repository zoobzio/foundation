<script lang="ts">
import { ListboxRoot, ListboxContent, ListboxItem } from "reka-ui";
import type { ListboxProps, ListboxEmits } from "../types/listbox";
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

const el = useTemplateRef("el");
defineExpose({ el });

const _handleUpdate = (value: string | string[]) => {
  emit("update:modelValue", value);
};

const ctx = computed(() => ({ items, modelValue, multiple, disabled }));
</script>

<template>
  <ListboxRoot
    ref="el"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    v-bind="pt?.root"
    class="f-listbox-root"
  >
    <slot name="content" v-bind="ctx">
      <ListboxContent
        v-bind="pt?.content"
        class="f-listbox-content"
      >
        <ListboxItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
          v-bind="pt?.item"
          class="f-listbox-item"
        >
          <slot name="item" v-bind="{ ...ctx, item }">
            {{ item.label }}
          </slot>
        </ListboxItem>
      </ListboxContent>
    </slot>
  </ListboxRoot>
</template>

