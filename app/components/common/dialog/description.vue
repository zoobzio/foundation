<script lang="ts">
import type {
  DialogDescriptionContext,
  DialogDescriptionForward,
  DialogDescriptionProps,
  DialogDescriptionSlots,
} from "#foundation/types/common/dialog/description";
import type { ComponentPublicInstance } from "vue";

import { DialogDescription, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DialogDescriptionProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dialog-description", DialogDescriptionForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DialogDescriptionContext>("dialog-description", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DialogDescriptionSlots>();
</script>

<template>
  <DialogDescription ref="el" class="f-dialog-description" v-bind="bindings">
    <slot v-bind="ctx" />
  </DialogDescription>
</template>
