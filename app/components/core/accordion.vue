<script lang="ts">
import type {
  AccordionProps,
  AccordionEmits,
  AccordionPassthrough,
  AccordionContext,
  AccordionSlots,
} from "../../types/core/accordion";
import type { ComponentPublicInstance } from "vue";

import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
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
  <AccordionRoot ref="el" class="f-accordion-root" v-bind="settings.root">
    <template v-for="item in items" :key="item.value">
      <AccordionItem
        v-slot="{ open }"
        class="f-accordion-item"
        v-bind="settings.item(item)"
      >
        <slot name="item" v-bind="{ ...ctx, item, open }">
          <AccordionHeader class="f-accordion-header" v-bind="settings.header">
            <slot name="header" v-bind="{ ...ctx, item, open }">
              <AccordionTrigger class="f-accordion-trigger" v-bind="settings.trigger">
                <slot name="trigger" v-bind="{ ...ctx, item, open }">
                  <slot name="triggerContent" v-bind="{ ...ctx, item, open }">
                    <div class="f-group">
                      <Icon
                        v-if="item.icon"
                        class="f-icon"
                        fill="currentColor"
                        :name="item.icon"
                      />
                      {{ item.label }}
                    </div>
                  </slot>
                  <slot name="chevron" v-bind="{ ...ctx, item, open }">
                    <Icon
                      class="f-icon"
                      fill="currentColor"
                      :name="open ? 'chevron-down' : 'chevron-right'"
                    />
                  </slot>
                </slot>
              </AccordionTrigger>
            </slot>
          </AccordionHeader>
          <AccordionContent class="f-accordion-content" v-bind="settings.content">
            <slot name="content" v-bind="{ ...ctx, item, open }" />
          </AccordionContent>
        </slot>
      </AccordionItem>
    </template>
  </AccordionRoot>
</template>
