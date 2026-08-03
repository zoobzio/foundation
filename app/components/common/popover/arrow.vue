<script lang="ts">
import type {
  PopoverArrowContext,
  PopoverArrowForward,
  PopoverArrowProps,
  PopoverArrowSlots,
} from "#foundation/types/common/popover/arrow";
import type { ComponentPublicInstance } from "vue";

import { PopoverArrow, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<PopoverArrowProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"popover-arrow", PopoverArrowForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<PopoverArrowContext>("popover-arrow", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PopoverArrowSlots>();
</script>

<template>
  <PopoverArrow
    ref="el"
    class="f-popover-arrow"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </PopoverArrow>
</template>
