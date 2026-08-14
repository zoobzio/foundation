<script lang="ts">
import type {
  ScrollAreaThumbContext,
  ScrollAreaThumbForward,
  ScrollAreaThumbProps,
  ScrollAreaThumbSlots,
} from "../../../types/common/scroll-area/thumb";
import type { ComponentPublicInstance } from "vue";

import { ScrollAreaThumb, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ScrollAreaThumbProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"scroll-area-thumb", ScrollAreaThumbForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ScrollAreaThumbContext>("scroll-area-thumb", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ScrollAreaThumbSlots>();
</script>

<template>
  <ScrollAreaThumb ref="el" class="f-scroll-area-thumb" v-bind="bindings">
    <slot v-bind="ctx" />
  </ScrollAreaThumb>
</template>
