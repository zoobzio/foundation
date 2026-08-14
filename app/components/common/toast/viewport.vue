<script lang="ts">
import type {
  ToastViewportContext,
  ToastViewportForward,
  ToastViewportProps,
  ToastViewportSlots,
} from "../../../types/common/toast/viewport";
import type { ComponentPublicInstance } from "vue";

import { ToastViewport, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ToastViewportProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"toast-viewport", ToastViewportForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToastViewportContext>("toast-viewport", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToastViewportSlots>();
</script>

<template>
  <ToastViewport ref="el" class="f-toast-viewport" v-bind="bindings">
    <slot v-bind="ctx" />
  </ToastViewport>
</template>
