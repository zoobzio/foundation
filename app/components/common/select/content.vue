<script lang="ts">
import type {
  SelectContentContext,
  SelectContentForward,
  SelectContentProps,
  SelectContentSlots,
} from "../../../types/common/select/content";
import type { ComponentPublicInstance } from "vue";

import { SelectContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<SelectContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"select-content", SelectContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<SelectContentContext>("select-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SelectContentSlots>();
</script>

<template>
  <SelectContent
    ref="el"
    class="f-select-content"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </SelectContent>
</template>
