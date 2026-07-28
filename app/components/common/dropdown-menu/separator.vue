<script lang="ts">
import type {
  DropdownMenuSeparatorContext,
  DropdownMenuSeparatorForward,
  DropdownMenuSeparatorProps,
  DropdownMenuSeparatorSlots,
} from "#foundation/types/common/dropdown-menu/separator";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuSeparator, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuSeparatorProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-separator", DropdownMenuSeparatorForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuSeparatorContext>("dropdown-menu-separator", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuSeparatorSlots>();
</script>

<template>
  <DropdownMenuSeparator ref="el" class="f-dropdown-menu-separator" v-bind="bindings">
    <slot v-bind="ctx" />
  </DropdownMenuSeparator>
</template>
