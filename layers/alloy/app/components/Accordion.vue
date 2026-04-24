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

const rootPT = usePassthrough(pt?.root, {
  props: { type, collapsible, defaultValue },
});
const headerPT = usePassthrough(pt?.header, {});
const triggerPT = usePassthrough(pt?.trigger, {});
const contentPT = usePassthrough(pt?.content, {});

const itemsPT = computed(() =>
  items.map((item) => ({
    item,
    pt: passthrough(pt?.item, {
      props: { value: item.value },
    }),
  })),
);

const ctx = computed(() => ({ items, type, collapsible, defaultValue }));
</script>

<template>
  <AccordionRoot
    ref="el"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-accordion-root"
  >
    <AccordionItem
      v-for="entry in itemsPT"
      :key="entry.item.value"
      v-slot="{ open }"
      v-bind="entry.pt.props"
      v-on="entry.pt.handlers"
      class="f-accordion-item"
    >
      <slot name="item" v-bind="{ ...ctx, item: entry.item, open }">
        <AccordionHeader
          v-bind="headerPT.props"
          v-on="headerPT.handlers"
          class="f-accordion-header"
        >
          <slot name="header" v-bind="{ ...ctx, item: entry.item, open }">
            <AccordionTrigger
              v-bind="triggerPT.props"
              v-on="triggerPT.handlers"
              class="f-accordion-trigger"
              :aria-selected="open"
            >
              <slot name="trigger" v-bind="{ ...ctx, item: entry.item, open }">
                <Group class="f-accordion-trigger-content">
                  <Icon v-if="entry.item.icon" :alias="entry.item.icon" />
                  {{ entry.item.label }}
                </Group>
                <Icon :alias="open ? 'chevron-down' : 'chevron-right'" />
              </slot>
            </AccordionTrigger>
          </slot>
        </AccordionHeader>
        <AccordionContent
          v-bind="contentPT.props"
          v-on="contentPT.handlers"
          class="f-accordion-content"
        >
          <slot name="content" v-bind="{ ...ctx, item: entry.item, open }" />
        </AccordionContent>
      </slot>
    </AccordionItem>
  </AccordionRoot>
</template>
