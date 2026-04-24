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

const rootPT = usePassthrough(pt?.root, {
  props: { type, scrollHideDelay, dir },
});
const viewportPT = usePassthrough(pt?.viewport, {});
const scrollbarPT = usePassthrough(pt?.scrollbar, {});
const thumbPT = usePassthrough(pt?.thumb, {});
const cornerPT = usePassthrough(pt?.corner, {});

const ctx = computed(() => ({ type, scrollHideDelay, dir, orientation }));
</script>

<template>
  <ScrollAreaRoot
    ref="el"
    v-bind="rootPT.props"
    v-on="rootPT.handlers"
    class="f-scroller-root"
  >
    <ScrollAreaViewport v-bind="viewportPT.props" v-on="viewportPT.handlers" class="f-scroller-viewport">
      <slot v-bind="ctx" />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="orientation === 'vertical' || orientation === 'both'"
      orientation="vertical"
      v-bind="scrollbarPT.props"
      v-on="scrollbarPT.handlers"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb v-bind="thumbPT.props" v-on="thumbPT.handlers" class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
      v-bind="scrollbarPT.props"
      v-on="scrollbarPT.handlers"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb v-bind="thumbPT.props" v-on="thumbPT.handlers" class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-if="orientation === 'both'"
      v-bind="cornerPT.props"
      v-on="cornerPT.handlers"
      class="f-scroller-corner"
    />
  </ScrollAreaRoot>
</template>
