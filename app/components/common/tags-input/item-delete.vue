<script lang="ts">
import type {
  TagsInputItemDeleteContext,
  TagsInputItemDeleteEmits,
  TagsInputItemDeleteForward,
  TagsInputItemDeleteProps,
  TagsInputItemDeleteSlots,
} from "../../../types/common/tags-input/item-delete";
import type { ComponentPublicInstance } from "vue";

import { TagsInputItemDelete, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<TagsInputItemDeleteProps>();

const emit = defineEmits<TagsInputItemDeleteEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"tags-input-item-delete", TagsInputItemDeleteForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TagsInputItemDeleteContext>("tags-input-item-delete", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TagsInputItemDeleteSlots>();
</script>

<template>
  <TagsInputItemDelete
    ref="el"
    class="f-tags-input-item-delete"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </TagsInputItemDelete>
</template>
