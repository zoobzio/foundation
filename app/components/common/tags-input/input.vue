<script lang="ts">
import type {
  TagsInputInputContext,
  TagsInputInputForward,
  TagsInputInputProps,
} from "#foundation/types/common/tags-input/input";
import type { ComponentPublicInstance } from "vue";

import { TagsInputInput, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TagsInputInputProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tags-input-input", TagsInputInputForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TagsInputInputContext>("tags-input-input", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <TagsInputInput ref="el" class="f-tags-input-input" v-bind="bindings" />
</template>
