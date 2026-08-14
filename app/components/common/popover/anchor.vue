<script lang="ts">
import type {
  PopoverAnchorContext,
  PopoverAnchorForward,
  PopoverAnchorProps,
  PopoverAnchorSlots,
} from "../../../types/common/popover/anchor";
import type { ComponentPublicInstance } from "vue";

import { PopoverAnchor, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<PopoverAnchorProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"popover-anchor", PopoverAnchorForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<PopoverAnchorContext>("popover-anchor", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PopoverAnchorSlots>();
</script>

<template>
  <PopoverAnchor
    ref="el"
    class="f-popover-anchor"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </PopoverAnchor>
</template>
