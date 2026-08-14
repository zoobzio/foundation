<script lang="ts">
import type {
  DialogOverlayContext,
  DialogOverlayForward,
  DialogOverlayProps,
  DialogOverlaySlots,
} from "../../../types/common/dialog/overlay";
import type { ComponentPublicInstance } from "vue";

import { DialogOverlay, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DialogOverlayProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dialog-overlay", DialogOverlayForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DialogOverlayContext>("dialog-overlay", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DialogOverlaySlots>();
</script>

<template>
  <DialogOverlay ref="el" class="f-dialog-overlay" v-bind="bindings">
    <slot v-bind="ctx" />
  </DialogOverlay>
</template>
