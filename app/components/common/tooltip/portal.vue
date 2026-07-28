<script lang="ts">
import type {
  TooltipPortalContext,
  TooltipPortalProps,
  TooltipPortalSlots,
} from "#foundation/types/common/tooltip/portal";

import { TooltipPortal, useForwardProps } from "reka-ui";

import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<TooltipPortalProps>();

const forward = useForwardProps(rest);

const ctx = useContext<TooltipPortalContext>("tooltip-portal", () => ({ ...forward.value }));

defineExpose({ ctx });
defineSlots<TooltipPortalSlots>();
</script>

<template>
  <TooltipPortal v-bind="forward">
    <slot v-bind="ctx" />
  </TooltipPortal>
</template>
