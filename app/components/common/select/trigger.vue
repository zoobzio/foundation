<script lang="ts">
import type {
  SelectTriggerContext,
  SelectTriggerEmits,
  SelectTriggerForward,
  SelectTriggerProps,
  SelectTriggerSlots,
} from "#foundation/types/common/select/trigger";
import type { ComponentPublicInstance } from "vue";

import { SelectTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<SelectTriggerProps>();

const emit = defineEmits<SelectTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"select-trigger", SelectTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<SelectTriggerContext>("select-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SelectTriggerSlots>();
</script>

<template>
  <SelectTrigger
    ref="el"
    class="f-select-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </SelectTrigger>
</template>
