<script lang="ts">
import type {
  SelectPortalContext,
  SelectPortalProps,
  SelectPortalSlots,
} from "../../../types/common/select/portal";

import { SelectPortal, useForwardProps } from "reka-ui";

import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { ...rest } = defineProps<SelectPortalProps>();

const forward = useForwardProps(rest);

const ctx = useContext<SelectPortalContext>("select-portal", () => ({ ...forward.value }));

defineExpose({ ctx });
defineSlots<SelectPortalSlots>();
</script>

<template>
  <SelectPortal v-bind="forward">
    <slot v-bind="ctx" />
  </SelectPortal>
</template>
