<script lang="ts">
import type {
  DropdownMenuGroupContext,
  DropdownMenuGroupForward,
  DropdownMenuGroupProps,
  DropdownMenuGroupSlots,
} from "#foundation/types/common/dropdown-menu/group";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuGroup, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuGroupProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-group", DropdownMenuGroupForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuGroupContext>("dropdown-menu-group", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuGroupSlots>();
</script>

<template>
  <DropdownMenuGroup ref="el" class="f-dropdown-menu-group" v-bind="bindings">
    <slot v-bind="ctx" />
  </DropdownMenuGroup>
</template>
