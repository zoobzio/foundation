<script lang="ts">
import type {
  TagsInputRootContext,
  TagsInputRootEmits,
  TagsInputRootForward,
  TagsInputRootProps,
  TagsInputRootSlots,
} from "#foundation/types/common/tags-input/root";
import type { AcceptableInputValue } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import { TagsInputRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  modelValue = undefined,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<TagsInputRootProps>();

const emit = defineEmits<TagsInputRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<AcceptableInputValue[]>(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps(rest);

const bindings = useBindings<"tags-input-root", TagsInputRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<TagsInputRootContext>("tags-input-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TagsInputRootSlots>();
</script>

<template>
  <TagsInputRoot
    ref="el"
    v-model="$model"
    class="f-tags-input-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </TagsInputRoot>
</template>
