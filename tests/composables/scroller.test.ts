import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import type { ComponentPublicInstance, MaybeRefOrGetter } from "vue";
import { useScroller } from "#foundation/composables/scroller";

type Scroller = ReturnType<typeof useScroller>;

// useScroller relies on onMounted/onBeforeUnmount, so it must run inside a
// component instance. Mount a headless host that calls it and hands back the
// returned api plus the wrapper (for unmount). The viewport is a stand-in
// instance exposing a real `div` as its `$el`, so scroll events can be driven
// against the actual DOM node the composable listens on — mirroring how the
// core component reaches the viewport through the wrapper's `$el`.
const mountScroller = (
  viewport: MaybeRefOrGetter<ComponentPublicInstance | null>,
) => {
  let api!: Scroller;
  const Host = defineComponent({
    setup() {
      api = useScroller(viewport);
      return () => null;
    },
  });
  const wrapper = mount(Host);
  return { wrapper, api };
};

// A real element wrapped as a component instance ({ $el }) — what the composable
// unwraps to reach the scrollable node.
const makeViewport = () => {
  const el = document.createElement("div");
  const instance = { $el: el } as unknown as ComponentPublicInstance;
  return { el, instance };
};

const scrollTo = (el: HTMLElement, top: number) => {
  Object.defineProperty(el, "scrollTop", { value: top, configurable: true });
  el.dispatchEvent(new Event("scroll"));
};

describe("useScroller", () => {
  it("starts unscrolled", () => {
    const { instance } = makeViewport();
    const { api } = mountScroller(ref(instance));
    expect(api.scrollY.value).toBe(0);
    expect(api.isScrolled.value).toBe(false);
  });

  it("tracks the viewport's scrollTop into scrollY", async () => {
    const { el, instance } = makeViewport();
    const { api } = mountScroller(ref(instance));

    scrollTo(el, 150);
    await nextTick();

    expect(api.scrollY.value).toBe(150);
  });

  it("isScrolled flips true once scrolled past the top", async () => {
    const { el, instance } = makeViewport();
    const { api } = mountScroller(ref(instance));

    scrollTo(el, 1);
    await nextTick();
    expect(api.isScrolled.value).toBe(true);

    scrollTo(el, 0);
    await nextTick();
    expect(api.isScrolled.value).toBe(false);
  });

  it("scrollToTop smooth-scrolls the viewport to the top", () => {
    const { el, instance } = makeViewport();
    el.scrollTo = vi.fn();
    const { api } = mountScroller(ref(instance));

    api.scrollToTop();

    expect(el.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("stops tracking after unmount", async () => {
    const { el, instance } = makeViewport();
    const { wrapper, api } = mountScroller(ref(instance));

    scrollTo(el, 100);
    await nextTick();
    expect(api.scrollY.value).toBe(100);

    wrapper.unmount();

    // Listener was removed on unmount — further scrolls are ignored.
    scrollTo(el, 400);
    await nextTick();
    expect(api.scrollY.value).toBe(100);
  });

  it("accepts a getter for the viewport", async () => {
    const { el, instance } = makeViewport();
    const { api } = mountScroller(() => instance);

    scrollTo(el, 42);
    await nextTick();

    expect(api.scrollY.value).toBe(42);
  });

  it("is inert when the viewport is absent", () => {
    const { api } = mountScroller(ref(null));
    expect(api.isScrolled.value).toBe(false);
    // No element to scroll — scrollToTop is a no-op rather than a throw.
    expect(() => api.scrollToTop()).not.toThrow();
  });
});
