<script lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "reka-ui";
import type { AccordionProps } from "#foundation/types/core/accordion";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { passthrough } from "#foundation/utils/passthrough";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
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
  handlers: {},
});

const headerPT = usePassthrough(pt?.header, { props: {}, handlers: {} });

const triggerPT = usePassthrough(pt?.trigger, { props: {}, handlers: {} });

const triggerContentPT = usePassthrough(pt?.triggerContent, {
  props: {},
  handlers: {},
});

const contentPT = usePassthrough(pt?.content, { props: {}, handlers: {} });

const itemsPT = computed(() =>
  items.map((item) => ({
    item,
    pt: passthrough(pt?.item, {
      props: { value: item.value },
      handlers: {},
    }),
    iconPT: item.icon
      ? passthrough(pt?.triggerIcon, {
          props: { alias: item.icon },
          handlers: {},
        })
      : null,
  })),
);

const chevronPT = (open: boolean) =>
  passthrough(pt?.chevron, {
    props: { alias: open ? "chevron-down" : "chevron-right" },
    handlers: {},
  });

const ctx = computed(() => ({ items, type, collapsible, defaultValue }));
</script>

<template>
  <AccordionRoot
    ref="el"
    v-bind="rootPT.props"
    class="f-accordion-root"
    v-on="rootPT.handlers"
  >
    <AccordionItem
      v-for="entry in itemsPT"
      :key="entry.item.value"
      v-slot="{ open }"
      v-bind="entry.pt.props"
      class="f-accordion-item"
      v-on="entry.pt.handlers"
    >
      <slot name="item" v-bind="{ ...ctx, item: entry.item, open }">
        <AccordionHeader
          v-bind="headerPT.props"
          class="f-accordion-header"
          v-on="headerPT.handlers"
        >
          <slot name="header" v-bind="{ ...ctx, item: entry.item, open }">
            <AccordionTrigger
              v-bind="triggerPT.props"
              class="f-accordion-trigger"
              v-on="triggerPT.handlers"
            >
              <slot name="trigger" v-bind="{ ...ctx, item: entry.item, open }">
                <slot
                  name="triggerContent"
                  v-bind="{ ...ctx, item: entry.item, open }"
                >
                  <Group
                    v-bind="triggerContentPT.props"
                    class="f-accordion-trigger-content"
                    v-on="triggerContentPT.handlers"
                  >
                    <Icon
                      v-if="entry.iconPT"
                      v-bind="entry.iconPT.props"
                      v-on="entry.iconPT.handlers"
                    />
                    {{ entry.item.label }}
                  </Group>
                </slot>
                <slot
                  name="chevron"
                  v-bind="{ ...ctx, item: entry.item, open }"
                >
                  <Icon
                    v-bind="chevronPT(open).props"
                    v-on="chevronPT(open).handlers"
                  />
                </slot>
              </slot>
            </AccordionTrigger>
          </slot>
        </AccordionHeader>
        <AccordionContent
          v-bind="contentPT.props"
          class="f-accordion-content"
          v-on="contentPT.handlers"
        >
          <slot name="content" v-bind="{ ...ctx, item: entry.item, open }" />
        </AccordionContent>
      </slot>
    </AccordionItem>
  </AccordionRoot>
</template>
