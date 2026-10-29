import type { ComponentPublicInstance, MaybeRefOrGetter } from "vue";

import { computed, onBeforeUnmount, onMounted, ref, toValue } from "vue";

/**
 * A viewport component: reka's `ScrollAreaViewport` exposes the element
 * that scrolls as `viewportElement`, since its root is a fragment (the
 * element and a style tag) whose `$el` is the fragment's anchor, not the
 * element. A component with an element root serves `$el`.
 */
type Viewport = ComponentPublicInstance & { viewportElement?: HTMLElement };

/**
 * Tracks the scroll offset of a viewport component.
 *
 * @param viewport - The component instance whose viewport element scrolls.
 */
export const useScroller = (viewport: MaybeRefOrGetter<Viewport | null>) => {
  const scrollY = ref(0);
  const isScrolled = computed(() => scrollY.value > 0);

  const getViewportEl = (): HTMLElement | null => {
    const instance = toValue(viewport);
    return instance?.viewportElement ?? instance?.$el ?? null;
  };

  onMounted(() => {
    const el = getViewportEl();
    if (!el) return;
    const onScroll = () => {
      scrollY.value = el.scrollTop;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onBeforeUnmount(() => el.removeEventListener("scroll", onScroll));
  });

  const scrollToTop = () => {
    getViewportEl()?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    scrollY,
    isScrolled,
    scrollToTop,
  };
};
