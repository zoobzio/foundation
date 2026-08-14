<script lang="ts">
import type {
  ToastTitleContext,
  ToastTitleForward,
  ToastTitleProps,
  ToastTitleSlots,
} from "../../../types/common/toast/title";
import type { ComponentPublicInstance } from "vue";

import { ToastTitle, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ToastTitleProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"toast-title", ToastTitleForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToastTitleContext>("toast-title", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToastTitleSlots>();
</script>

<template>
  <ToastTitle ref="el" class="f-toast-title" v-bind="bindings">
    <slot v-bind="ctx" />
  </ToastTitle>
</template>
