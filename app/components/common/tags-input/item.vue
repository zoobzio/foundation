<script lang="ts">
import type {
  TagsInputItemContext,
  TagsInputItemForward,
  TagsInputItemProps,
  TagsInputItemSlots,
} from "#foundation/types/common/tags-input/item";
import type { ComponentPublicInstance } from "vue";

import { TagsInputItem, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TagsInputItemProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tags-input-item", TagsInputItemForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TagsInputItemContext>("tags-input-item", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TagsInputItemSlots>();
</script>

<template>
  <TagsInputItem ref="el" class="f-tags-input-item" v-bind="bindings">
    <slot v-bind="ctx" />
  </TagsInputItem>
</template>
