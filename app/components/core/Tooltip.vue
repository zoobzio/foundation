<script lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from "reka-ui";
import type { TooltipProps } from "#foundation/types/core/tooltip";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { TOOLTIP_SIDE_OFFSET } from "#foundation/constants/core/tooltip";
const {
  content,
  delayDuration = 0,
  side = "bottom",
  align = "center",
  sideOffset = TOOLTIP_SIDE_OFFSET,
  pt,
} = defineProps<TooltipProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {
  props: { delayDuration },
  handlers: {},
});
const contentPT = usePassthrough(pt?.content, {
  props: { side, align, sideOffset },
  handlers: {},
});

const ctx = computed(() => ({ content, delayDuration, side, align, sideOffset }));
</script>

<template>
  <TooltipRoot ref="el" v-bind="rootPT.props" v-on="rootPT.handlers">
    <TooltipTrigger as-child>
      <slot v-bind="ctx" />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        v-bind="contentPT.props"
        class="f-tooltip-content"
        v-on="contentPT.handlers"
      >
        <slot name="content" v-bind="ctx">
          {{ content }}
        </slot>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
