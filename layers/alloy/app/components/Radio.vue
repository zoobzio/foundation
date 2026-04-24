<script lang="ts">
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from "reka-ui";
import type { RadioProps } from "../types/radio";
</script>

<script setup lang="ts">
const {
  options,
  disabled,
  required,
  name,
  orientation = "vertical",
  pt,
} = defineProps<RadioProps>();

const model = defineModel<string>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {
  props: { disabled, required, name, orientation },
});
const indicatorPT = usePassthrough(pt?.indicator, {});

const optionsPT = computed(() =>
  options.map((option) => ({
    item: option,
    optionPt: passthrough(pt?.option, {}),
    itemPt: passthrough(pt?.item, {
      props: { value: option.value, disabled: option.disabled },
    }),
  })),
);

const ctx = computed(() => ({ options, disabled, required, name, orientation, model: model.value }));
</script>

<template>
  <RadioGroupRoot
    ref="el"
    v-model="model"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-radio-root"
  >
    <template v-for="entry in optionsPT" :key="entry.item.value">
      <slot name="option" v-bind="{ ...ctx, option: entry.item }">
        <Label
          v-bind="entry.optionPt.props"
          v-on="entry.optionPt.handlers"
          class="f-radio-option"
        >
          <RadioGroupItem
            v-bind="entry.itemPt.props"
            v-on="entry.itemPt.handlers"
            class="f-radio-item"
          >
            <slot name="indicator" v-bind="{ ...ctx, option: entry.item }">
              <RadioGroupIndicator v-bind="indicatorPT.props" v-on="indicatorPT.handlers" class="f-radio-indicator" />
            </slot>
          </RadioGroupItem>
          <Span class="f-radio-label">{{ entry.item.label }}</Span>
        </Label>
      </slot>
    </template>
  </RadioGroupRoot>
</template>
