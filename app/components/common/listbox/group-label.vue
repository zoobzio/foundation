<script lang="ts">
import type {
  ListboxGroupLabelContext,
  ListboxGroupLabelForward,
  ListboxGroupLabelProps,
  ListboxGroupLabelSlots,
} from "../../../types/common/listbox/group-label";
import type { ComponentPublicInstance } from "vue";

import { ListboxGroupLabel, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ListboxGroupLabelProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"listbox-group-label", ListboxGroupLabelForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ListboxGroupLabelContext>("listbox-group-label", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ListboxGroupLabelSlots>();
</script>

<template>
  <ListboxGroupLabel ref="el" class="f-listbox-group-label" v-bind="bindings">
    <slot v-bind="ctx" />
  </ListboxGroupLabel>
</template>
