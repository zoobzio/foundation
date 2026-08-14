<script lang="ts">
import type {
  ToastRootContext,
  ToastRootForward,
  ToastRootProps,
  ToastRootSlots,
} from "../../../types/common/toast/root";
import type { ComponentPublicInstance } from "vue";

import { ToastRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  open = undefined,
  defaultOpen = true,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<ToastRootProps>();

// Only the model event is declared; reka's remaining emits (pause, resume,
// swipe*, escapeKeyDown) fall through as attrs onto the primitive.
const emit = defineEmits<{ "update:open": [value: boolean] }>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const forward = useForwardProps(rest);

const bindings = useBindings<"toast-root", ToastRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToastRootContext>("toast-root", () => ({
  ...forward.value,
  defaultOpen,
  modifiers,
  tokens,
  aria,
  open: $open,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToastRootSlots>();
</script>

<template>
  <ToastRoot
    ref="el"
    v-model:open="$open"
    class="f-toast-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </ToastRoot>
</template>
