<script lang="ts">
import type {
  ListboxItemContext,
  ListboxItemEmits,
  ListboxItemForward,
  ListboxItemProps,
  ListboxItemSlots,
} from "../../../types/common/listbox/item";
import type { ComponentPublicInstance } from "vue";

import { ListboxItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ListboxItemProps>();

const emit = defineEmits<ListboxItemEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"listbox-item", ListboxItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ListboxItemContext>("listbox-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ListboxItemSlots>();
</script>

<template>
  <ListboxItem
    ref="el"
    class="f-listbox-item"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </ListboxItem>
</template>
