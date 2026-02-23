<script setup lang="ts">
import type { MultiSelectProps } from "../types/multi-select";

const {
  items,
  placeholder = "Select options",
  disabled,
} = defineProps<MultiSelectProps>();

const model = defineModel<string[]>({ default: () => [] });

const open = ref(false);

const displayText = computed(() => {
  if (!model.value.length) return placeholder;
  if (model.value.length === 1) {
    const item = items.find((i) => i.value === model.value[0]);
    return item?.label ?? model.value[0];
  }
  return `${model.value.length} selected`;
});

const isSelected = (value: string) => model.value.includes(value);

const toggle = (value: string) => {
  if (isSelected(value)) {
    model.value = model.value.filter((v) => v !== value);
  } else {
    model.value = [...model.value, value];
  }
};
</script>

<template>
  <Popover v-model:open="open" :disabled="disabled">
    <button
      type="button"
      class="f-multiselect-trigger"
      :disabled="disabled"
    >
      <span>{{ displayText }}</span>
      <Icon alias="chevron-down" />
    </button>
    <template #content>
      <div class="f-multiselect-content">
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          class="f-multiselect-item"
          :disabled="item.disabled"
          @click="toggle(item.value)"
        >
          <Checkbox
            :model-value="isSelected(item.value)"
            :disabled="item.disabled"
            tabindex="-1"
          />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </template>
  </Popover>
</template>
