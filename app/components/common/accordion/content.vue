<script lang="ts">
import type {
  AccordionContentContext,
  AccordionContentForward,
  AccordionContentProps,
  AccordionContentSlots,
} from "../../../types/common/accordion/content";
import type { ComponentPublicInstance } from "vue";

import { AccordionContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AccordionContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"accordion-content", AccordionContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AccordionContentContext>("accordion-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AccordionContentSlots>();
</script>

<template>
  <AccordionContent ref="el" class="f-accordion-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </AccordionContent>
</template>
