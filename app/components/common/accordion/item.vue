<script lang="ts">
import type {
  AccordionItemContext,
  AccordionItemForward,
  AccordionItemProps,
  AccordionItemSlots,
} from "../../../types/common/accordion/item";
import type { ComponentPublicInstance } from "vue";

import { AccordionItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<AccordionItemProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"accordion-item", AccordionItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AccordionItemContext>("accordion-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AccordionItemSlots>();
</script>

<template>
  <AccordionItem ref="el" class="f-accordion-item" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </AccordionItem>
</template>
