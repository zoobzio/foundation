<script lang="ts">
import type {
  ScrollAreaViewportContext,
  ScrollAreaViewportForward,
  ScrollAreaViewportProps,
  ScrollAreaViewportSlots,
} from "../../../types/common/scroll-area/viewport";
import type { ComponentPublicInstance } from "vue";

import { ScrollAreaViewport, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ScrollAreaViewportProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"scroll-area-viewport", ScrollAreaViewportForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ScrollAreaViewportContext>("scroll-area-viewport", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ScrollAreaViewportSlots>();
</script>

<template>
  <ScrollAreaViewport ref="el" class="f-scroll-area-viewport" v-bind="bindings">
    <slot v-bind="ctx" />
  </ScrollAreaViewport>
</template>
