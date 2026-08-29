<script lang="ts">
import type {
  AutocompleteItemContext,
  AutocompleteItemForward,
  AutocompleteItemProps,
  AutocompleteItemSlots,
} from "../../../types/common/autocomplete/item";
import type { ComponentPublicInstance } from "vue";

import { AutocompleteItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<AutocompleteItemProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"autocomplete-item", AutocompleteItemForward>(
  () => ({
    modifiers,
    tokens,
    aria,
    forward: forward.value,
  }),
);

const ctx = useContext<AutocompleteItemContext>("autocomplete-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AutocompleteItemSlots>();
</script>

<template>
  <AutocompleteItem
    ref="el"
    class="f-autocomplete-item"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </AutocompleteItem>
</template>
