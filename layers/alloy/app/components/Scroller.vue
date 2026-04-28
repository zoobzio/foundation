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

// Scroll tracking — always active, used by backToTop
const viewportRef = useTemplateRef<InstanceType<typeof ScrollAreaViewport>>("viewport");
const scrollY = ref(0);
const isScrolled = computed(() => scrollY.value > 0);

const getViewportEl = (): HTMLElement | null =>
  viewportRef.value?.viewportElement ?? null;

onMounted(() => {
  const viewport = getViewportEl();
  if (!viewport) return;
  const onScroll = () => {
    scrollY.value = viewport.scrollTop;
  };
  viewport.addEventListener("scroll", onScroll, { passive: true });
  onBeforeUnmount(() => viewport.removeEventListener("scroll", onScroll));
});

const handleScrollToTop = () => {
  getViewportEl()?.scrollTo({ top: 0, behavior: "smooth" });
};

const rootPT = usePassthrough(pt?.root, {
  props: { type, scrollHideDelay, dir },
  handlers: {},
});
const viewportPT = usePassthrough(pt?.viewport, { props: {}, handlers: {} });
const scrollbarPT = usePassthrough(pt?.scrollbar, { props: {}, handlers: {} });
const thumbPT = usePassthrough(pt?.thumb, { props: {}, handlers: {} });
const cornerPT = usePassthrough(pt?.corner, { props: {}, handlers: {} });
const backToTopPT = usePassthrough(pt?.backToTop, () => ({
  props: {},
  handlers: { click: handleScrollToTop },
}));

const ctx = computed(() => ({ type, scrollHideDelay, dir, orientation, isScrolled: isScrolled.value }));
</script>

<template>
  <ScrollAreaRoot
    ref="el"
    v-bind="rootPT.props"
    class="f-scroller-root"
    v-on="rootPT.handlers"
  >
    <slot name="viewport" v-bind="ctx">
      <ScrollAreaViewport ref="viewport" v-bind="viewportPT.props" class="f-scroller-viewport" v-on="viewportPT.handlers">
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

    <slot name="backToTop" v-bind="ctx">
      <Button
        v-if="isScrolled"
        v-bind="backToTopPT.props"
        class="f-scroller-back-to-top"
        v-on="backToTopPT.handlers"
      >
        <Icon alias="arrow-up" />
        <Span class="f-scroller-back-to-top-label">Back to top</Span>
      </Button>
    </slot>
  </ScrollAreaRoot>
</template>
