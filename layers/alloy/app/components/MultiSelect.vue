<script lang="ts">
import type { MultiSelectProps } from "../types/multi-select";
</script>

<script setup lang="ts">
const {
  pt,
  items,
  placeholder = "Select options",
  disabled,
} = defineProps<MultiSelectProps>();

const model = defineModel<string[]>({ default: () => [] });

const el = useTemplateRef("el");
defineExpose({ el });

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

const ctx = computed(() => ({
  items,
  placeholder,
  disabled,
  model: model.value,
  open: open.value,
  displayText: displayText.value,
  isSelected,
}));

const toggle = (value: string) => {
  if (isSelected(value)) {
    model.value = model.value.filter((v) => v !== value);
  } else {
    model.value = [...model.value, value];
  }
};
</script>

<template>
  <Popover ref="el" v-model:open="open" :disabled="disabled">
    <slot name="trigger" v-bind="ctx">
      <Button
        v-bind="pt?.trigger"
        class="f-multiselect-trigger"
        :disabled="disabled"
      >
        <Span>{{ displayText }}</Span>
        <Icon alias="chevron-down" />
      </Button>
    </slot>
    <template #content>
      <Group v-bind="pt?.content" class="f-multiselect-content">
        <slot v-for="item in items" name="item" v-bind="{ ...ctx, item, selected: isSelected(item.value) }">
          <Button
            :key="item.value"
            v-bind="pt?.item"
            class="f-multiselect-item"
            :disabled="item.disabled"
            @click="toggle(item.value)"
          >
            <Checkbox
              :model-value="isSelected(item.value)"
              :disabled="item.disabled"
              tabindex="-1"
            />
            <Span>{{ item.label }}</Span>
          </Button>
        </slot>
      </Group>
    </template>
  </Popover>
</template>
