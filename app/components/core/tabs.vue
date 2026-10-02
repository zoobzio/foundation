<script lang="ts">
import type {
  TabsProps,
  TabsEmits,
  TabsPassthrough,
  TabsContext,
  TabsSlots,
  TabsOption,
} from "../../types/core/tabs";
import type { ComponentPublicInstance } from "vue";

import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="T extends TabsOption">
const { modelValue, tabs, pt } = defineProps<TabsProps<T>>();

const emit = defineEmits<TabsEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TabsPassthrough<T>>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      activationMode: tabs.some((option) => option.link)
        ? "manual"
        : "automatic",
      "onUpdate:modelValue": (v) => {
        $model.value = String(v);
      },
    },
    list: {},
    trigger: (option) => ({
      value: option.value,
      disabled: option.disabled,
      // as-child onto the anchor; `as` off "button" drops reka's type attr.
      asChild: !!option.link,
      as: option.link ? "a" : undefined,
    }),
    content: (option) => ({
      value: option.value,
    }),
  },
}));

const ctx = useContext<TabsContext<T>>("tabs", () => ({
  tabs,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TabsSlots<T>>();
</script>

<template>
  <TabsRoot ref="el" class="f-tabs-root" v-bind="settings.root">
    <slot name="list" v-bind="ctx">
      <TabsList class="f-tabs-list" v-bind="settings.list">
        <template v-for="option in tabs" :key="option.value">
          <TabsTrigger class="f-tabs-trigger" v-bind="settings.trigger(option)">
            <NuxtLink
              v-if="option.link"
              :to="option.disabled ? undefined : option.link.to"
              :external="option.link.external"
              :target="option.link.target"
              :replace="option.link.replace"
              :prefetch="option.link.prefetch"
            >
              <slot name="trigger" v-bind="{ ...ctx, option }">
                <slot name="triggerIcon" v-bind="{ ...ctx, option }" />
                {{ option.label }}
              </slot>
            </NuxtLink>
            <slot v-else name="trigger" v-bind="{ ...ctx, option }">
              <slot name="triggerIcon" v-bind="{ ...ctx, option }" />
              {{ option.label }}
            </slot>
          </TabsTrigger>
        </template>
      </TabsList>
    </slot>
    <template v-for="option in tabs" :key="option.value">
      <TabsContent class="f-tabs-content" v-bind="settings.content(option)">
        <slot name="content" v-bind="{ ...ctx, option }" />
      </TabsContent>
    </template>
  </TabsRoot>
</template>
