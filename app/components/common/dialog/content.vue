<script lang="ts">
import type {
  DialogContentContext,
  DialogContentForward,
  DialogContentProps,
  DialogContentSlots,
} from "#foundation/types/common/dialog/content";
import type { ComponentPublicInstance } from "vue";

import { DialogContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DialogContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dialog-content", DialogContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DialogContentContext>("dialog-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DialogContentSlots>();
</script>

<template>
  <DialogContent ref="el" class="f-dialog-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </DialogContent>
</template>
