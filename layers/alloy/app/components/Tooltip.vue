<script lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from "reka-ui";
import type { TooltipProps } from "../types/tooltip";
</script>

<script setup lang="ts">
const {
  content,
  delayDuration = 0,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  pt,
} = defineProps<TooltipProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ content, delayDuration, side, align, sideOffset }));
</script>

<template>
  <TooltipRoot ref="el" v-bind="pt?.root" :delay-duration="delayDuration">
    <TooltipTrigger as-child>
      <slot v-bind="ctx" />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        v-bind="pt?.content"
        class="f-tooltip-content"
      >
        <slot name="content" v-bind="ctx">
          {{ content }}
        </slot>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

