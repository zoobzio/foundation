<script lang="ts">
import type {
  TabsProps,
  TabsEmits,
  TabsPassthrough,
  TabsContext,
  TabsSlots,
} from "../../types/core/tabs";
import type { ComponentPublicInstance } from "vue";

import TabsRoot from "../common/tabs/root.vue";
import TabsList from "../common/tabs/list.vue";
import TabsTrigger from "../common/tabs/trigger.vue";
import TabsContent from "../common/tabs/content.vue";
import Icon from "../common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, tabs, pt } = defineProps<TabsProps>();

const emit = defineEmits<TabsEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<TabsPassthrough>(() => ({
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
    triggerIcon: (option) => ({
      alias: option.icon ?? "",
    }),
    content: (option) => ({
      value: option.value,
    }),
  },
}));

const ctx = useContext<TabsContext>("tabs", () => ({
  tabs,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<TabsSlots>();
</script>

<template>
  <TabsRoot ref="el" v-bind="settings.root">
    <slot name="list" v-bind="ctx">
      <TabsList v-bind="settings.list">
        <template v-for="option in tabs" :key="option.value">
          <TabsTrigger v-bind="settings.trigger(option)">
            <slot name="trigger" v-bind="{ ...ctx, option }">
              <Icon v-if="option.icon" v-bind="settings.triggerIcon(option)" />
              {{ option.label }}
            </slot>
          </TabsTrigger>
        </template>
      </TabsList>
    </slot>
    <template v-for="option in tabs" :key="option.value">
      <TabsContent v-bind="settings.content(option)">
        <slot name="content" v-bind="{ ...ctx, option }" />
      </TabsContent>
    </template>
  </TabsRoot>
</template>
