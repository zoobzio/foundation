<script lang="ts">
import type {
  TabsProps,
  TabsEmits,
  TabsPassthrough,
  TabsContext,
  TabsSlots,
} from "../../types/core/tabs";
import type { Option } from "../../types/core/common";
import type { ComponentPublicInstance } from "vue";

import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts" generic="T extends Option">
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
      "onUpdate:modelValue": (v) => {
        $model.value = String(v);
      },
    },
    list: {},
    trigger: (option) => ({
      value: option.value,
      disabled: option.disabled,
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
            <slot name="trigger" v-bind="{ ...ctx, option }">
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
