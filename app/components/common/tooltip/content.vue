<script lang="ts">
import type {
  TooltipContentContext,
  TooltipContentForward,
  TooltipContentProps,
  TooltipContentSlots,
} from "#foundation/types/common/tooltip/content";
import type { ComponentPublicInstance } from "vue";

import { TooltipContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<TooltipContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tooltip-content", TooltipContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TooltipContentContext>("tooltip-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TooltipContentSlots>();
</script>

<template>
  <TooltipContent
    ref="el"
    class="f-tooltip-content"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </TooltipContent>
</template>
