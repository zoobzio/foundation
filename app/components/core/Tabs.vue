<script lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import type { TabsProps, TabsEmits } from "#foundation/types/core/tabs";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { passthrough } from "#foundation/utils/passthrough";
import Icon from "#foundation/components/common/icon.vue";
const { modelValue, tabs: tabItems, pt } = defineProps<TabsProps>();

const emit = defineEmits<TabsEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, () => ({
  props: { modelValue },
  handlers: { "update:modelValue": (v: string | number) => { emit("update:modelValue", String(v)); } },
}));
const listPT = usePassthrough(pt?.list, { props: {}, handlers: {} });

const triggersPT = computed(() =>
  tabItems.map((tab) => ({
    item: tab,
    pt: passthrough(pt?.trigger, {
      props: { value: tab.value, disabled: tab.disabled },
      handlers: {},
    }),
    iconPT: tab.icon
      ? passthrough(pt?.triggerIcon, { props: { alias: tab.icon }, handlers: {} })
      : null,
  })),
);

const contentsPT = computed(() =>
  tabItems.map((tab) => ({
    item: tab,
    pt: passthrough(pt?.content, {
      props: { value: tab.value },
      handlers: {},
    }),
  })),
);

const ctx = computed(() => ({ tabs: tabItems, model: modelValue }));
</script>

<template>
  <TabsRoot ref="el" v-bind="rootPT.props" class="f-tabs-root" v-on="rootPT.handlers">
    <slot name="list" v-bind="ctx">
      <TabsList v-bind="listPT.props" class="f-tabs-list" v-on="listPT.handlers">
        <TabsTrigger
          v-for="entry in triggersPT"
          :key="entry.item.value"
          v-bind="entry.pt.props"
          class="f-tabs-trigger"
          v-on="entry.pt.handlers"
        >
          <slot name="trigger" v-bind="{ ...ctx, tab: entry.item }">
            <Icon v-if="entry.iconPT" v-bind="entry.iconPT.props" v-on="entry.iconPT.handlers" />
            {{ entry.item.label }}
          </slot>
        </TabsTrigger>
      </TabsList>
    </slot>

    <TabsContent
      v-for="entry in contentsPT"
      :key="entry.item.value"
      v-bind="entry.pt.props"
      class="f-tabs-content"
      v-on="entry.pt.handlers"
    >
      <slot :name="entry.item.value" v-bind="{ ...ctx, tab: entry.item }" />
    </TabsContent>
  </TabsRoot>
</template>
