<script lang="ts">
import type {
  ListboxGroupContext,
  ListboxGroupForward,
  ListboxGroupProps,
  ListboxGroupSlots,
} from "#foundation/types/common/listbox/group";
import type { ComponentPublicInstance } from "vue";

import { ListboxGroup, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ListboxGroupProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"listbox-group", ListboxGroupForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ListboxGroupContext>("listbox-group", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ListboxGroupSlots>();
</script>

<template>
  <ListboxGroup ref="el" class="f-listbox-group" v-bind="bindings">
    <slot v-bind="ctx" />
  </ListboxGroup>
</template>
