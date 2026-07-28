<script lang="ts">
import type {
  DropdownMenuRootContext,
  DropdownMenuRootEmits,
  DropdownMenuRootProps,
  DropdownMenuRootSlots,
} from "#foundation/types/common/dropdown-menu/root";
import type { ComponentPublicInstance } from "vue";

import { DropdownMenuRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  open = undefined,
  defaultOpen = false,
  ...rest
} = defineProps<DropdownMenuRootProps>();

const emit = defineEmits<DropdownMenuRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const forward = useForwardProps(rest);

const ctx = useContext<DropdownMenuRootContext>("dropdown-menu-root", () => ({
  ...forward.value,
  defaultOpen,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuRootSlots>();
</script>

<template>
  <DropdownMenuRoot
    ref="el"
    v-model:open="$open"
    class="f-dropdown-menu-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </DropdownMenuRoot>
</template>
