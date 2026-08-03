<script lang="ts">
import type {
  ScrollerProps,
  ScrollerPassthrough,
  ScrollerContext,
  ScrollerSlots,
} from "#foundation/types/core/scroller";
import type { ComponentPublicInstance } from "vue";

import ScrollAreaRoot from "#foundation/components/common/scroll-area/root.vue";
import ScrollAreaViewport from "#foundation/components/common/scroll-area/viewport.vue";
import ScrollAreaScrollbar from "#foundation/components/common/scroll-area/scrollbar.vue";
import ScrollAreaThumb from "#foundation/components/common/scroll-area/thumb.vue";
import ScrollAreaCorner from "#foundation/components/common/scroll-area/corner.vue";
import Button from "#foundation/components/common/button.vue";
import Icon from "#foundation/components/common/icon.vue";
import Span from "#foundation/components/common/span.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useScroller } from "#foundation/composables/scroller";
import { SCROLLER_HIDE_DELAY } from "#foundation/constants/scroller";
</script>

<script setup lang="ts">
const {
  type = "hover",
  scrollHideDelay = SCROLLER_HIDE_DELAY,
  dir,
  orientation = "vertical",
  pt,
} = defineProps<ScrollerProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");
const viewport = useTemplateRef<ComponentPublicInstance>("viewport");

const { isScrolled, scrollToTop } = useScroller(viewport);

const settings = usePassthrough<ScrollerPassthrough>(() => ({
  pt,
  recipes: {
    root: { type, scrollHideDelay, dir },
    viewport: {},
    scrollbar: {},
    thumb: {},
    corner: {},
    backToTop: { onClick: scrollToTop },
  },
}));

const ctx = useContext<ScrollerContext>("scroller", () => ({
  type,
  scrollHideDelay,
  dir,
  orientation,
  isScrolled: isScrolled.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<ScrollerSlots>();
</script>

<template>
  <ScrollAreaRoot ref="el" v-bind="settings.root">
    <slot name="viewport" v-bind="ctx">
      <ScrollAreaViewport ref="viewport" v-bind="settings.viewport">
        <slot v-bind="ctx" />
      </ScrollAreaViewport>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'vertical' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'vertical' || orientation === 'both'"
        v-bind="{ ...settings.scrollbar, orientation: 'vertical' }"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb v-bind="settings.thumb" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'horizontal' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'horizontal' || orientation === 'both'"
        v-bind="{ ...settings.scrollbar, orientation: 'horizontal' }"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb v-bind="settings.thumb" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="corner" v-bind="ctx">
      <ScrollAreaCorner v-if="orientation === 'both'" v-bind="settings.corner" />
    </slot>

    <slot name="backToTop" v-bind="ctx">
      <Button v-if="isScrolled" v-bind="settings.backToTop">
        <Icon alias="arrow-up" />
        <Span>Back to top</Span>
      </Button>
    </slot>
  </ScrollAreaRoot>
</template>
