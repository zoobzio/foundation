<script lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner } from "reka-ui";
import type { ScrollerProps } from "../types/scroller";
</script>

<script setup lang="ts">
const {
  type = "hover",
  scrollHideDelay = 600,
  dir,
  orientation = "vertical",
  pt,
} = defineProps<ScrollerProps>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ type, scrollHideDelay, dir, orientation }));
</script>

<template>
  <ScrollAreaRoot
    ref="el"
    :type="type"
    :scroll-hide-delay="scrollHideDelay"
    :dir="dir"
    v-bind="pt?.root"
    class="f-scroller-root"
  >
    <ScrollAreaViewport v-bind="pt?.viewport" class="f-scroller-viewport">
      <slot v-bind="ctx" />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="orientation === 'vertical' || orientation === 'both'"
      orientation="vertical"
      v-bind="pt?.scrollbar"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb v-bind="pt?.thumb" class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
      v-bind="pt?.scrollbar"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb v-bind="pt?.thumb" class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-if="orientation === 'both'"
      v-bind="pt?.corner"
      class="f-scroller-corner"
    />
  </ScrollAreaRoot>
</template>
