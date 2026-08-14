<script lang="ts">
import type {
  PopoverPortalContext,
  PopoverPortalProps,
  PopoverPortalSlots,
} from "../../../types/common/popover/portal";

import { PopoverPortal, useForwardProps } from "reka-ui";

import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<PopoverPortalProps>();

const forward = useForwardProps(rest);

const ctx = useContext<PopoverPortalContext>("popover-portal", () => ({ ...forward.value }));

defineExpose({ ctx });
defineSlots<PopoverPortalSlots>();
</script>

<template>
  <PopoverPortal v-bind="forward">
    <slot v-bind="ctx" />
  </PopoverPortal>
</template>
