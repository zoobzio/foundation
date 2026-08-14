<script lang="ts">
import type {
  TabsContentContext,
  TabsContentForward,
  TabsContentProps,
  TabsContentSlots,
} from "../../../types/common/tabs/content";
import type { ComponentPublicInstance } from "vue";

import { TabsContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TabsContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tabs-content", TabsContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TabsContentContext>("tabs-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TabsContentSlots>();
</script>

<template>
  <TabsContent ref="el" class="f-tabs-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </TabsContent>
</template>
