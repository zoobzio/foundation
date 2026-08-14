<script lang="ts">
import type {
  DialogTitleContext,
  DialogTitleForward,
  DialogTitleProps,
  DialogTitleSlots,
} from "../../../types/common/dialog/title";
import type { ComponentPublicInstance } from "vue";

import { DialogTitle, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DialogTitleProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"dialog-title", DialogTitleForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DialogTitleContext>("dialog-title", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DialogTitleSlots>();
</script>

<template>
  <DialogTitle ref="el" class="f-dialog-title" v-bind="bindings">
    <slot v-bind="ctx" />
  </DialogTitle>
</template>
