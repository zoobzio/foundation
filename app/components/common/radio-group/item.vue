<script lang="ts">
import type {
  RadioGroupItemContext,
  RadioGroupItemEmits,
  RadioGroupItemForward,
  RadioGroupItemProps,
  RadioGroupItemSlots,
} from "../../../types/common/radio-group/item";
import type { ComponentPublicInstance } from "vue";

import { RadioGroupItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<RadioGroupItemProps>();

const emit = defineEmits<RadioGroupItemEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"radio-group-item", RadioGroupItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RadioGroupItemContext>("radio-group-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RadioGroupItemSlots>();
</script>

<template>
  <RadioGroupItem
    ref="el"
    class="f-radio-group-item"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </RadioGroupItem>
</template>
