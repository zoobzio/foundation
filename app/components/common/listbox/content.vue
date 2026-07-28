<script lang="ts">
import type {
  ListboxContentContext,
  ListboxContentForward,
  ListboxContentProps,
  ListboxContentSlots,
} from "#foundation/types/common/listbox/content";
import type { ComponentPublicInstance } from "vue";

import { ListboxContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<ListboxContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"listbox-content", ListboxContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ListboxContentContext>("listbox-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ListboxContentSlots>();
</script>

<template>
  <ListboxContent
    ref="el"
    class="f-listbox-content"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </ListboxContent>
</template>
