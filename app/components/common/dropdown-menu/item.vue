<script lang="ts">
import type {
  DropdownMenuItemContext,
  DropdownMenuItemEmits,
  DropdownMenuItemForward,
  DropdownMenuItemProps,
  DropdownMenuItemSlots,
} from "#foundation/types/common/dropdown-menu/item";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuItemProps>();

const emit = defineEmits<DropdownMenuItemEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-item", DropdownMenuItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuItemContext>("dropdown-menu-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuItemSlots>();
</script>

<template>
  <DropdownMenuItem
    ref="el"
    class="f-dropdown-menu-item"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </DropdownMenuItem>
</template>
