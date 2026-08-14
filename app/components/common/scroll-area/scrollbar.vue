<script lang="ts">
import type {
  ScrollAreaScrollbarContext,
  ScrollAreaScrollbarForward,
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarSlots,
} from "../../../types/common/scroll-area/scrollbar";
import type { ComponentPublicInstance } from "vue";

import { ScrollAreaScrollbar, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ScrollAreaScrollbarProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"scroll-area-scrollbar", ScrollAreaScrollbarForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ScrollAreaScrollbarContext>("scroll-area-scrollbar", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ScrollAreaScrollbarSlots>();
</script>

<template>
  <ScrollAreaScrollbar ref="el" class="f-scroll-area-scrollbar" v-bind="bindings">
    <slot v-bind="ctx" />
  </ScrollAreaScrollbar>
</template>
