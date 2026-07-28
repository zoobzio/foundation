<script lang="ts">
import type {
  ScrollAreaRootContext,
  ScrollAreaRootForward,
  ScrollAreaRootProps,
  ScrollAreaRootSlots,
} from "#foundation/types/common/scroll-area/root";
import type { ComponentPublicInstance } from "vue";

import { ScrollAreaRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ScrollAreaRootProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"scroll-area-root", ScrollAreaRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ScrollAreaRootContext>("scroll-area-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ScrollAreaRootSlots>();
</script>

<template>
  <ScrollAreaRoot ref="el" class="f-scroll-area-root" v-bind="bindings">
    <slot v-bind="ctx" />
  </ScrollAreaRoot>
</template>
