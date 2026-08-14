<script lang="ts">
import type {
  TooltipProviderContext,
  TooltipProviderProps,
  TooltipProviderSlots,
} from "../../../types/common/tooltip/provider";

import { TooltipProvider, useForwardProps } from "reka-ui";

import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<TooltipProviderProps>();

const forward = useForwardProps(rest);

const ctx = useContext<TooltipProviderContext>("tooltip-provider", () => ({ ...forward.value }));

defineExpose({ ctx });
defineSlots<TooltipProviderSlots>();
</script>

<template>
  <TooltipProvider v-bind="forward">
    <slot v-bind="ctx" />
  </TooltipProvider>
</template>
