<script lang="ts">
import type {
  AccordionTriggerContext,
  AccordionTriggerEmits,
  AccordionTriggerForward,
  AccordionTriggerProps,
  AccordionTriggerSlots,
} from "../../../types/common/accordion/trigger";
import type { ComponentPublicInstance } from "vue";

import { AccordionTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AccordionTriggerProps>();

const emit = defineEmits<AccordionTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"accordion-trigger", AccordionTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AccordionTriggerContext>("accordion-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AccordionTriggerSlots>();
</script>

<template>
  <AccordionTrigger
    ref="el"
    class="f-accordion-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </AccordionTrigger>
</template>
