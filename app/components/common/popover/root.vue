<script lang="ts">
import type {
  PopoverRootContext,
  PopoverRootEmits,
  PopoverRootProps,
  PopoverRootSlots,
} from "#foundation/types/common/popover/root";
import type { ComponentPublicInstance } from "vue";

import { PopoverRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  open = undefined,
  defaultOpen = false,
  ...rest
} = defineProps<PopoverRootProps>();

const emit = defineEmits<PopoverRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const forward = useForwardProps(rest);

const ctx = useContext<PopoverRootContext>("popover-root", () => ({
  ...forward.value,
  defaultOpen,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<PopoverRootSlots>();
</script>

<template>
  <PopoverRoot
    ref="el"
    v-model:open="$open"
    class="f-popover-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </PopoverRoot>
</template>
