<script lang="ts">
import type {
  AccordionProps,
  AccordionEmits,
  AccordionPassthrough,
  AccordionContext,
  AccordionSlots,
} from "#foundation/types/core/accordion";
import type { ComponentPublicInstance } from "vue";

import AccordionRoot from "#foundation/components/common/accordion/root.vue";
import AccordionItem from "#foundation/components/common/accordion/item.vue";
import AccordionHeader from "#foundation/components/common/accordion/header.vue";
import AccordionTrigger from "#foundation/components/common/accordion/trigger.vue";
import AccordionContent from "#foundation/components/common/accordion/content.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  items,
  modelValue,
  type = "single",
  collapsible = true,
  defaultValue,
  pt,
} = defineProps<AccordionProps>();

const emit = defineEmits<AccordionEmits>();

const $model = useModel<string | string[] | undefined>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<AccordionPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      type,
      collapsible,
      defaultValue,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
    },
    item: (option) => ({ value: option.value }),
    header: {},
    trigger: {},
    triggerContent: {},
    triggerIcon: (option) => ({ alias: option.icon ?? "" }),
    chevron: (open) => ({ alias: open ? "chevron-down" : "chevron-right" }),
    content: {},
  },
}));

const ctx = useContext<AccordionContext>("accordion", () => ({
  items,
  type,
  collapsible,
  defaultValue,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<AccordionSlots>();
</script>

<template>
  <AccordionRoot ref="el" v-bind="settings.root">
    <template v-for="item in items" :key="item.value">
      <AccordionItem v-slot="{ open }" v-bind="settings.item(item)">
        <slot name="item" v-bind="{ ...ctx, item, open }">
          <AccordionHeader v-bind="settings.header">
            <slot name="header" v-bind="{ ...ctx, item, open }">
              <AccordionTrigger v-bind="settings.trigger">
                <slot name="trigger" v-bind="{ ...ctx, item, open }">
                  <slot name="triggerContent" v-bind="{ ...ctx, item, open }">
                    <Group v-bind="settings.triggerContent">
                      <Icon
                        v-if="item.icon"
                        v-bind="settings.triggerIcon(item)"
                      />
                      {{ item.label }}
                    </Group>
                  </slot>
                  <slot name="chevron" v-bind="{ ...ctx, item, open }">
                    <Icon v-bind="settings.chevron(open)" />
                  </slot>
                </slot>
              </AccordionTrigger>
            </slot>
          </AccordionHeader>
          <AccordionContent v-bind="settings.content">
            <slot name="content" v-bind="{ ...ctx, item, open }" />
          </AccordionContent>
        </slot>
      </AccordionItem>
    </template>
  </AccordionRoot>
</template>
