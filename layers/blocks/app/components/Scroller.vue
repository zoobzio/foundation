<script setup lang="ts">
import type { ScrollerProps } from "../types/scroller";

const {
  type = "hover",
  scrollHideDelay = 600,
  dir,
  orientation = "vertical",
} = defineProps<ScrollerProps>();
</script>

<template>
  <ScrollAreaRoot
    :type="type"
    :scroll-hide-delay="scrollHideDelay"
    :dir="dir"
    class="f-scroller-root"
  >
    <ScrollAreaViewport class="f-scroller-viewport">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="orientation === 'vertical' || orientation === 'both'"
      orientation="vertical"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      orientation="horizontal"
      class="f-scroller-scrollbar"
    >
      <ScrollAreaThumb class="f-scroller-thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-if="orientation === 'both'"
      class="f-scroller-corner"
    />
  </ScrollAreaRoot>
</template>
