<script lang="ts">
import type {
  DropdownMenuContentContext,
  DropdownMenuContentForward,
  DropdownMenuContentProps,
  DropdownMenuContentSlots,
} from "../../../types/common/dropdown-menu/content";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-content", DropdownMenuContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuContentContext>("dropdown-menu-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuContentSlots>();
</script>

<template>
  <DropdownMenuContent ref="el" class="f-dropdown-menu-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </DropdownMenuContent>
</template>
