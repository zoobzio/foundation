<script lang="ts">
import type { MultiSelectProps, MultiSelectEmits } from "#foundation/types/core/multi-select";
</script>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { MultiSelect } from "#foundation/utils/multi-select";
import { passthrough } from "#foundation/utils/passthrough";
import Button from "#foundation/components/common/Button.vue";
import Checkbox from "#foundation/components/core/Checkbox.vue";
import Group from "#foundation/components/common/Group.vue";
import Icon from "#foundation/components/common/Icon.vue";
import Popover from "#foundation/components/core/Popover.vue";
import Span from "#foundation/components/common/Span.vue";
const {
  modelValue,
  pt,
  items,
  placeholder = "Select options",
  disabled,
} = defineProps<MultiSelectProps>();

const emit = defineEmits<MultiSelectEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const open = ref(false);

const displayText = computed(() =>
  MultiSelect.display(items, modelValue ?? [], placeholder),
);

const isSelected = (value: string) => (modelValue ?? []).includes(value);

const toggle = (value: string) => {
  emit("update:modelValue", MultiSelect.toggle(modelValue ?? [], value));
};

const popoverPT = usePassthrough(pt?.popover, () => ({
  props: { open: open.value, disabled },
  handlers: { "update:open": (v: boolean) => { open.value = v; } },
}));
const triggerPT = usePassthrough(pt?.trigger, {
  props: { disabled },
  handlers: {},
});
const triggerLabelPT = usePassthrough(pt?.triggerLabel, { props: {}, handlers: {} });
const triggerIconPT = usePassthrough(pt?.triggerIcon, { props: { alias: "chevron-down" }, handlers: {} });
const contentPT = usePassthrough(pt?.content, { props: {}, handlers: {} });
const itemCheckboxPT = usePassthrough(pt?.itemCheckbox, { props: {}, handlers: {} });
const itemLabelPT = usePassthrough(pt?.itemLabel, { props: {}, handlers: {} });

const itemsPT = computed(() =>
  items.map((item) => ({
    item,
    pt: passthrough(pt?.item, {
      props: { disabled: item.disabled },
      handlers: { click: () => toggle(item.value) },
    }),
  })),
);

const ctx = computed(() => ({
  items,
  placeholder,
  disabled,
  model: modelValue ?? [],
  open: open.value,
  displayText: displayText.value,
  isSelected,
}));
</script>

<template>
  <Popover ref="el" v-bind="popoverPT.props" v-on="popoverPT.handlers">
    <template #trigger>
    <slot name="trigger" v-bind="ctx">
      <Button
        v-bind="triggerPT.props"
        class="f-multiselect-trigger"
        v-on="triggerPT.handlers"
      >
        <slot name="triggerLabel" v-bind="ctx">
          <Span v-bind="triggerLabelPT.props" v-on="triggerLabelPT.handlers">{{ displayText }}</Span>
        </slot>
        <slot name="triggerIcon" v-bind="ctx">
          <Icon v-bind="triggerIconPT.props" v-on="triggerIconPT.handlers" />
        </slot>
      </Button>
    </slot>
    </template>
    <template #content>
      <slot name="content" v-bind="ctx">
        <Group v-bind="contentPT.props" class="f-multiselect-content" v-on="contentPT.handlers">
          <template v-for="entry in itemsPT" :key="entry.item.value">
            <slot name="item" v-bind="{ ...ctx, item: entry.item, selected: isSelected(entry.item.value) }">
              <Button
                v-bind="entry.pt.props"
                class="f-multiselect-item"
                v-on="entry.pt.handlers"
              >
                <slot name="itemCheckbox" v-bind="{ ...ctx, item: entry.item, selected: isSelected(entry.item.value) }">
                  <Checkbox
                    v-bind="{ ...itemCheckboxPT.props, modelValue: isSelected(entry.item.value), disabled: entry.item.disabled }"
                    v-on="itemCheckboxPT.handlers"
                  />
                </slot>
                <slot name="itemLabel" v-bind="{ ...ctx, item: entry.item }">
                  <Span v-bind="itemLabelPT.props" v-on="itemLabelPT.handlers">{{ entry.item.label }}</Span>
                </slot>
              </Button>
            </slot>
          </template>
        </Group>
      </slot>
    </template>
  </Popover>
</template>
