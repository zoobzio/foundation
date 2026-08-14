<script lang="ts">
import type {
  RadioGroupIndicatorContext,
  RadioGroupIndicatorForward,
  RadioGroupIndicatorProps,
  RadioGroupIndicatorSlots,
} from "../../../types/common/radio-group/indicator";
import type { ComponentPublicInstance } from "vue";

import { RadioGroupIndicator, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<RadioGroupIndicatorProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"radio-group-indicator", RadioGroupIndicatorForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RadioGroupIndicatorContext>("radio-group-indicator", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RadioGroupIndicatorSlots>();
</script>

<template>
  <RadioGroupIndicator
    ref="el"
    class="f-radio-group-indicator"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </RadioGroupIndicator>
</template>
