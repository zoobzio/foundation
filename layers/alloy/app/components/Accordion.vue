<script lang="ts">
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from "reka-ui";
import type { AccordionProps } from "../types/accordion";
</script>

<script setup lang="ts">
const {
  items,
  type = "single",
  collapsible = true,
  defaultValue,
  pt,
} = defineProps<AccordionProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ items, type, collapsible, defaultValue }));

</script>

<template>
  <AccordionRoot
    ref="el"
    :type="type"
    :collapsible="collapsible"
    :default-value="defaultValue"
    v-bind="pt?.root"
    class="f-accordion-root"
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      v-slot="{ open }"
      :value="item.value"
      v-bind="pt?.item"
      class="f-accordion-item"
    >
      <slot name="item" v-bind="{ ...ctx, item, open }">
        <AccordionHeader
          v-bind="pt?.header"
          class="f-accordion-header"
        >
          <slot name="header" v-bind="{ ...ctx, item, open }">
            <AccordionTrigger
              v-bind="pt?.trigger"
              class="f-accordion-trigger"
              :aria-selected="open"
            >
              <slot name="trigger" v-bind="{ ...ctx, item, open }">
                <Group class="f-accordion-trigger-content">
                  <Icon v-if="item.icon" :alias="item.icon" />
                  {{ item.label }}
                </Group>
                <Icon :alias="open ? 'chevron-down' : 'chevron-right'" />
              </slot>
            </AccordionTrigger>
          </slot>
        </AccordionHeader>
        <AccordionContent
          v-bind="pt?.content"
          class="f-accordion-content"
        >
          <slot name="content" v-bind="{ ...ctx, item, open }" />
        </AccordionContent>
      </slot>
    </AccordionItem>
  </AccordionRoot>
</template>

