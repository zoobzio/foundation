<script lang="ts">
import type {
  ScrollAreaCornerContext,
  ScrollAreaCornerForward,
  ScrollAreaCornerProps,
  ScrollAreaCornerSlots,
} from "#foundation/types/common/scroll-area/corner";
import type { ComponentPublicInstance } from "vue";

import { ScrollAreaCorner, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ScrollAreaCornerProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"scroll-area-corner", ScrollAreaCornerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ScrollAreaCornerContext>("scroll-area-corner", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ScrollAreaCornerSlots>();
</script>

<template>
  <ScrollAreaCorner ref="el" class="f-scroll-area-corner" v-bind="bindings">
    <slot v-bind="ctx" />
  </ScrollAreaCorner>
</template>
