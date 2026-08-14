<script lang="ts">
import type {
  TabsListContext,
  TabsListForward,
  TabsListProps,
  TabsListSlots,
} from "../../../types/common/tabs/list";
import type { ComponentPublicInstance } from "vue";

import { TabsList, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TabsListProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tabs-list", TabsListForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TabsListContext>("tabs-list", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TabsListSlots>();
</script>

<template>
  <TabsList ref="el" class="f-tabs-list" v-bind="bindings">
    <slot v-bind="ctx" />
  </TabsList>
</template>
