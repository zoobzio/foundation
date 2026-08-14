<script lang="ts">
import type {
  PopoverTriggerContext,
  PopoverTriggerEmits,
  PopoverTriggerForward,
  PopoverTriggerProps,
  PopoverTriggerSlots,
} from "../../../types/common/popover/trigger";
import type { ComponentPublicInstance } from "vue";

import { PopoverTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<PopoverTriggerProps>();

const emit = defineEmits<PopoverTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"popover-trigger", PopoverTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<PopoverTriggerContext>("popover-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PopoverTriggerSlots>();
</script>

<template>
  <PopoverTrigger
    ref="el"
    class="f-popover-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </PopoverTrigger>
</template>
