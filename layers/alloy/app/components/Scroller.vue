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
  handlers: {},
});
const viewportPT = usePassthrough(pt?.viewport, { props: {}, handlers: {} });
const scrollbarPT = usePassthrough(pt?.scrollbar, { props: {}, handlers: {} });
const thumbPT = usePassthrough(pt?.thumb, { props: {}, handlers: {} });
const cornerPT = usePassthrough(pt?.corner, { props: {}, handlers: {} });

const ctx = computed(() => ({ type, scrollHideDelay, dir, orientation }));
</script>

<template>
  <ScrollAreaRoot
    ref="el"
    v-bind="rootPT.props"
    class="f-scroller-root"
    v-on="rootPT.handlers"
  >
    <slot name="viewport" v-bind="ctx">
      <ScrollAreaViewport v-bind="viewportPT.props" class="f-scroller-viewport" v-on="viewportPT.handlers">
        <slot name="content" v-bind="ctx" />
      </ScrollAreaViewport>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'vertical' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'vertical' || orientation === 'both'"
        v-bind="{ ...scrollbarPT.props, orientation: 'vertical' }"
        class="f-scroller-scrollbar"
        v-on="scrollbarPT.handlers"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb v-bind="thumbPT.props" class="f-scroller-thumb" v-on="thumbPT.handlers" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'horizontal' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'horizontal' || orientation === 'both'"
        v-bind="{ ...scrollbarPT.props, orientation: 'horizontal' }"
        class="f-scroller-scrollbar"
        v-on="scrollbarPT.handlers"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb v-bind="thumbPT.props" class="f-scroller-thumb" v-on="thumbPT.handlers" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="corner" v-bind="ctx">
      <ScrollAreaCorner
        v-if="orientation === 'both'"
        v-bind="cornerPT.props"
        class="f-scroller-corner"
        v-on="cornerPT.handlers"
      />
    </slot>
  </ScrollAreaRoot>
</template>
