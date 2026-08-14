<script lang="ts">
import type {
  SelectItemContext,
  SelectItemEmits,
  SelectItemForward,
  SelectItemProps,
  SelectItemSlots,
} from "../../../types/common/select/item";
import type { ComponentPublicInstance } from "vue";

import { SelectItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<SelectItemProps>();

const emit = defineEmits<SelectItemEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"select-item", SelectItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<SelectItemContext>("select-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SelectItemSlots>();
</script>

<template>
  <SelectItem
    ref="el"
    class="f-select-item"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </SelectItem>
</template>
