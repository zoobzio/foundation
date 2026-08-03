<script lang="ts">
import type {
  TagsInputItemTextContext,
  TagsInputItemTextForward,
  TagsInputItemTextProps,
  TagsInputItemTextSlots,
} from "#foundation/types/common/tags-input/item-text";
import type { ComponentPublicInstance } from "vue";

import { TagsInputItemText, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TagsInputItemTextProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tags-input-item-text", TagsInputItemTextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TagsInputItemTextContext>("tags-input-item-text", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TagsInputItemTextSlots>();
</script>

<template>
  <TagsInputItemText ref="el" class="f-tags-input-item-text" v-bind="bindings">
    <slot v-bind="ctx" />
  </TagsInputItemText>
</template>
