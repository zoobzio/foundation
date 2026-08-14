<script lang="ts">
import type {
  TabsTriggerContext,
  TabsTriggerEmits,
  TabsTriggerForward,
  TabsTriggerProps,
  TabsTriggerSlots,
} from "../../../types/common/tabs/trigger";
import type { ComponentPublicInstance } from "vue";

import { TabsTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TabsTriggerProps>();

const emit = defineEmits<TabsTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tabs-trigger", TabsTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TabsTriggerContext>("tabs-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TabsTriggerSlots>();
</script>

<template>
  <TabsTrigger
    ref="el"
    class="f-tabs-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </TabsTrigger>
</template>
