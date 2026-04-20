<script lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import type { TabsProps } from "../types/tabs";
</script>

<script setup lang="ts">
const { tabs: tabItems, pt } = defineProps<TabsProps>();

const model = defineModel<string>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ tabs: tabItems, model }));

</script>

<template>
  <TabsRoot ref="el" v-model="model" v-bind="pt?.root" class="f-tabs-root">
    <slot name="list" v-bind="ctx">
      <TabsList v-bind="pt?.list" class="f-tabs-list">
        <TabsTrigger
          v-for="tab in tabItems"
          :key="tab.value"
          :value="tab.value"
          :disabled="tab.disabled"
          v-bind="pt?.trigger"
          class="f-tabs-trigger"
        >
          <slot name="trigger" v-bind="{ ...ctx, tab }">
            <Icon v-if="tab.icon" :alias="tab.icon" />
            {{ tab.label }}
          </slot>
        </TabsTrigger>
      </TabsList>
    </slot>

    <TabsContent
      v-for="tab in tabItems"
      :key="tab.value"
      :value="tab.value"
      v-bind="pt?.content"
      class="f-tabs-content"
    >
      <slot :name="tab.value" v-bind="{ ...ctx, tab }" />
    </TabsContent>
  </TabsRoot>
</template>
