<script lang="ts">
import type {
  ToastCloseContext,
  ToastCloseEmits,
  ToastCloseForward,
  ToastCloseProps,
  ToastCloseSlots,
} from "../../../types/common/toast/close";
import type { ComponentPublicInstance } from "vue";

import { ToastClose, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ToastCloseProps>();

const emit = defineEmits<ToastCloseEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"toast-close", ToastCloseForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToastCloseContext>("toast-close", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToastCloseSlots>();
</script>

<template>
  <ToastClose
    ref="el"
    class="f-toast-close"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </ToastClose>
</template>
