<script lang="ts">
import type {
  ToastDescriptionContext,
  ToastDescriptionForward,
  ToastDescriptionProps,
  ToastDescriptionSlots,
} from "#foundation/types/common/toast/description";
import type { ComponentPublicInstance } from "vue";

import { ToastDescription, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ToastDescriptionProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"toast-description", ToastDescriptionForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToastDescriptionContext>("toast-description", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToastDescriptionSlots>();
</script>

<template>
  <ToastDescription ref="el" class="f-toast-description" v-bind="bindings">
    <slot v-bind="ctx" />
  </ToastDescription>
</template>
