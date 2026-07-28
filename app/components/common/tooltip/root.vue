<script lang="ts">
import type {
  TooltipRootContext,
  TooltipRootEmits,
  TooltipRootProps,
  TooltipRootSlots,
} from "#foundation/types/common/tooltip/root";
import type { ComponentPublicInstance } from "vue";

import { TooltipRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { open = undefined, ...rest } = defineProps<TooltipRootProps>();

const emit = defineEmits<TooltipRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const forward = useForwardProps(rest);

const ctx = useContext<TooltipRootContext>("tooltip-root", () => ({
  ...forward.value,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<TooltipRootSlots>();
</script>

<template>
  <TooltipRoot
    ref="el"
    v-model:open="$open"
    class="f-tooltip-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </TooltipRoot>
</template>
