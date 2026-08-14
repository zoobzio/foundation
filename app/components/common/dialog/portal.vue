<script lang="ts">
import type {
  DialogPortalContext,
  DialogPortalProps,
  DialogPortalSlots,
} from "../../../types/common/dialog/portal";

import { DialogPortal, useForwardProps } from "reka-ui";

import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<DialogPortalProps>();

const forward = useForwardProps(rest);

const ctx = useContext<DialogPortalContext>("dialog-portal", () => ({
  ...forward.value,
}));

defineExpose({ ctx });
defineSlots<DialogPortalSlots>();
</script>

<template>
  <DialogPortal v-bind="forward">
    <slot v-bind="ctx" />
  </DialogPortal>
</template>
