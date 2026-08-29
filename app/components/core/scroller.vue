<script lang="ts">
import type {
  ScrollerProps,
  ScrollerPassthrough,
  ScrollerContext,
  ScrollerSlots,
} from "../../types/core/scroller";
import type { ComponentPublicInstance } from "vue";

import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useContext } from "../../composables/context";
import { useScroller } from "../../composables/scroller";
import { SCROLLER_HIDE_DELAY } from "../../constants/scroller";
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
  <ScrollAreaRoot ref="el" class="f-scroll-area-root" v-bind="settings.root">
    <slot name="viewport" v-bind="ctx">
      <ScrollAreaViewport
        ref="viewport"
        class="f-scroll-area-viewport"
        v-bind="settings.viewport"
      >
        <slot v-bind="ctx" />
      </ScrollAreaViewport>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'vertical' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'vertical' || orientation === 'both'"
        class="f-scroll-area-scrollbar"
        v-bind="{ ...settings.scrollbar, orientation: 'vertical' }"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb class="f-scroll-area-thumb" v-bind="settings.thumb" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="scrollbar" v-bind="{ ...ctx, orientation: 'horizontal' }">
      <ScrollAreaScrollbar
        v-if="orientation === 'horizontal' || orientation === 'both'"
        class="f-scroll-area-scrollbar"
        v-bind="{ ...settings.scrollbar, orientation: 'horizontal' }"
      >
        <slot name="thumb" v-bind="ctx">
          <ScrollAreaThumb class="f-scroll-area-thumb" v-bind="settings.thumb" />
        </slot>
      </ScrollAreaScrollbar>
    </slot>

    <slot name="corner" v-bind="ctx">
      <ScrollAreaCorner
        v-if="orientation === 'both'"
        class="f-scroll-area-corner"
        v-bind="settings.corner"
      />
    </slot>

    <slot name="backToTop" v-bind="ctx">
      <button v-if="isScrolled" type="button" class="f-button" @click="scrollToTop">
        <Icon class="f-icon" fill="currentColor" name="arrow-up" />
        <span class="f-span">Back to top</span>
      </button>
    </slot>
  </ScrollAreaRoot>
</template>
