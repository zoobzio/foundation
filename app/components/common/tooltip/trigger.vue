<script lang="ts">
import type {
  TooltipTriggerContext,
  TooltipTriggerEmits,
  TooltipTriggerForward,
  TooltipTriggerProps,
  TooltipTriggerSlots,
} from "../../../types/common/tooltip/trigger";
import type { ComponentPublicInstance } from "vue";

import { TooltipTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<TooltipTriggerProps>();

const emit = defineEmits<TooltipTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tooltip-trigger", TooltipTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TooltipTriggerContext>("tooltip-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TooltipTriggerSlots>();
</script>

<template>
  <TooltipTrigger
    ref="el"
    class="f-tooltip-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </TooltipTrigger>
</template>
