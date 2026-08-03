<script lang="ts">
import type {
  DropdownMenuPortalContext,
  DropdownMenuPortalProps,
  DropdownMenuPortalSlots,
} from "#foundation/types/common/dropdown-menu/portal";

import { DropdownMenuPortal, useForwardProps } from "reka-ui";

import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<DropdownMenuPortalProps>();

const forward = useForwardProps(rest);

const ctx = useContext<DropdownMenuPortalContext>("dropdown-menu-portal", () => ({
  ...forward.value,
}));

defineExpose({ ctx });
defineSlots<DropdownMenuPortalSlots>();
</script>

<template>
  <DropdownMenuPortal v-bind="forward">
    <slot v-bind="ctx" />
  </DropdownMenuPortal>
</template>
