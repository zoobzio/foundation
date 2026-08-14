<script lang="ts">
import type {
  ToastProviderContext,
  ToastProviderProps,
  ToastProviderSlots,
} from "../../../types/common/toast/provider";

import { ToastProvider, useForwardProps } from "reka-ui";

import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<ToastProviderProps>();

const forward = useForwardProps(rest);

const ctx = useContext<ToastProviderContext>("toast-provider", () => ({ ...forward.value }));

defineExpose({ ctx });
defineSlots<ToastProviderSlots>();
</script>

<template>
  <ToastProvider v-bind="forward">
    <slot v-bind="ctx" />
  </ToastProvider>
</template>
