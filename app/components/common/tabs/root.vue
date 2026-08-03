<script lang="ts">
import type {
  TabsRootContext,
  TabsRootEmits,
  TabsRootProps,
  TabsRootSlots,
  TabsRootForward,
} from "#foundation/types/common/tabs/root";
import type { ComponentPublicInstance } from "vue";

import { TabsRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modelValue, modifiers, tokens, aria, ...rest } =
  defineProps<TabsRootProps>();

const emit = defineEmits<TabsRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps<TabsRootForward>(rest);

const bindings = useBindings<"tabs-root", TabsRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TabsRootContext>("tabs-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TabsRootSlots>();
</script>

<template>
  <TabsRoot ref="el" v-model="$model" class="f-tabs-root" v-bind="bindings">
    <slot v-bind="ctx" />
  </TabsRoot>
</template>
