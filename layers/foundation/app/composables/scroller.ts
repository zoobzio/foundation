import type { ComponentPublicInstance, MaybeRefOrGetter } from "vue";

import { computed, onBeforeUnmount, onMounted, ref, toValue } from "#imports";

export const useScroller = (
  viewport: MaybeRefOrGetter<ComponentPublicInstance | null>,
) => {
  const scrollY = ref(0);
  const isScrolled = computed(() => scrollY.value > 0);

  const getViewportEl = (): HTMLElement | null =>
    toValue(viewport)?.$el ?? null;

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
