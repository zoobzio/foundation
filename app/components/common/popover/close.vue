<script lang="ts">
import type {
  PopoverCloseContext,
  PopoverCloseEmits,
  PopoverCloseForward,
  PopoverCloseProps,
  PopoverCloseSlots,
} from "#foundation/types/common/popover/close";
import type { ComponentPublicInstance } from "vue";

import { PopoverClose, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<PopoverCloseProps>();

const emit = defineEmits<PopoverCloseEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"popover-close", PopoverCloseForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<PopoverCloseContext>("popover-close", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PopoverCloseSlots>();
</script>

<template>
  <PopoverClose
    ref="el"
    class="f-popover-close"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </PopoverClose>
</template>
