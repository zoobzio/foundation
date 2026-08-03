<script lang="ts">
import type {
  SelectItemTextContext,
  SelectItemTextForward,
  SelectItemTextProps,
  SelectItemTextSlots,
} from "#foundation/types/common/select/item-text";
import type { ComponentPublicInstance } from "vue";

import { SelectItemText, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<SelectItemTextProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"select-item-text", SelectItemTextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<SelectItemTextContext>("select-item-text", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SelectItemTextSlots>();
</script>

<template>
  <SelectItemText
    ref="el"
    class="f-select-item-text"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </SelectItemText>
</template>
