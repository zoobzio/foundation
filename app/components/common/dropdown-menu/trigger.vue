<script lang="ts">
import type {
  DropdownMenuTriggerContext,
  DropdownMenuTriggerEmits,
  DropdownMenuTriggerForward,
  DropdownMenuTriggerProps,
  DropdownMenuTriggerSlots,
} from "../../../types/common/dropdown-menu/trigger";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DropdownMenuTriggerProps>();

const emit = defineEmits<DropdownMenuTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dropdown-menu-trigger", DropdownMenuTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DropdownMenuTriggerContext>("dropdown-menu-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuTriggerSlots>();
</script>

<template>
  <DropdownMenuTrigger
    ref="el"
    class="f-dropdown-menu-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </DropdownMenuTrigger>
</template>
