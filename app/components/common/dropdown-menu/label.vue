<script lang="ts">
import type {
  DropdownMenuLabelContext,
  DropdownMenuLabelForward,
  DropdownMenuLabelProps,
  DropdownMenuLabelSlots,
} from "#foundation/types/common/dropdown-menu/label";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuLabel, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuLabelProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-label", DropdownMenuLabelForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuLabelContext>("dropdown-menu-label", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuLabelSlots>();
</script>

<template>
  <DropdownMenuLabel ref="el" class="f-dropdown-menu-label" v-bind="bindings">
    <slot v-bind="ctx" />
  </DropdownMenuLabel>
</template>
