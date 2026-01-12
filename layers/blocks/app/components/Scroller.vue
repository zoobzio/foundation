<script setup lang="ts">
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

<style>
/* Functional: required for scroll to work */
.f-scroller-root {
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

.f-scroller-viewport {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.f-scroller-viewport::-webkit-scrollbar {
  display: none;
}

.f-scroller-viewport:focus-visible {
  outline: none;
  box-shadow: var(--ref-shadow-focus-inset);
}

.f-scroller-scrollbar {
  display: flex;
  touch-action: none;
  user-select: none;
}

.f-scroller-scrollbar[data-orientation="vertical"] {
  width: 6px;
}

.f-scroller-scrollbar[data-orientation="horizontal"] {
  flex-direction: column;
  height: 6px;
}

.f-scroller-thumb {
  flex: 1;
  position: relative;
  background: var(--sys-outline);
}

/* Accessibility: touch target */
.f-scroller-thumb::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  min-width: 44px;
  min-height: 44px;
}

.f-scroller-corner {
  background: var(--sys-surface-container);
}
</style>
