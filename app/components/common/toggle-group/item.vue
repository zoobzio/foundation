<script lang="ts">
import type {
  ToggleGroupItemContext,
  ToggleGroupItemEmits,
  ToggleGroupItemForward,
  ToggleGroupItemProps,
  ToggleGroupItemSlots,
} from "#foundation/types/common/toggle-group/item";
import type { ComponentPublicInstance } from "vue";

import { ToggleGroupItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<ToggleGroupItemProps>();

const emit = defineEmits<ToggleGroupItemEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"toggle-group-item", ToggleGroupItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToggleGroupItemContext>("toggle-group-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToggleGroupItemSlots>();
</script>

<template>
  <ToggleGroupItem
    ref="el"
    class="f-toggle-group-item"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </ToggleGroupItem>
</template>
