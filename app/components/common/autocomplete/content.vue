<script lang="ts">
import type {
  AutocompleteContentContext,
  AutocompleteContentForward,
  AutocompleteContentProps,
  AutocompleteContentSlots,
} from "../../../types/common/autocomplete/content";
import type { ComponentPublicInstance } from "vue";

import { AutocompleteContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } =
  defineProps<AutocompleteContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"autocomplete-content", AutocompleteContentForward>(
  () => ({
    modifiers,
    tokens,
    aria,
    forward: forward.value,
  }),
);

const ctx = useContext<AutocompleteContentContext>(
  "autocomplete-content",
  () => ({
    ...forward.value,
    modifiers,
    tokens,
    aria,
    bindings: bindings.value,
    el: el.value,
  }),
);

defineExpose({ ctx });
defineSlots<AutocompleteContentSlots>();
</script>

<template>
  <AutocompleteContent
    ref="el"
    class="f-autocomplete-content"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </AutocompleteContent>
</template>
