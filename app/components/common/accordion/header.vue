<script lang="ts">
import type {
  AccordionHeaderContext,
  AccordionHeaderForward,
  AccordionHeaderProps,
  AccordionHeaderSlots,
} from "#foundation/types/common/accordion/header";
import type { ComponentPublicInstance } from "vue";

import { AccordionHeader, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AccordionHeaderProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"accordion-header", AccordionHeaderForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AccordionHeaderContext>("accordion-header", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AccordionHeaderSlots>();
</script>

<template>
  <AccordionHeader ref="el" class="f-accordion-header" v-bind="bindings">
    <slot v-bind="ctx" />
  </AccordionHeader>
</template>
