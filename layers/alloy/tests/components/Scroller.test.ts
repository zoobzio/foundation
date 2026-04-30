import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { mountScroller } from "../fixtures";
import { oreStubs, rekaStubs } from "../../../../packages/testing/helpers/stubs";
import Scroller from "../../app/components/Scroller.vue";

describe("Scroller", () => {
  describe("static", () => {
    const wrapper = mountScroller();

    it("renders root with f-scroller-root class", () => {
      expect(wrapper.find(".f-scroller-root").exists()).toBe(true);
    });

    it("shows vertical scrollbar by default", () => {
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("vertical");
    });
  });

  describe("conditional", () => {
    it("shows horizontal scrollbar when orientation='horizontal'", () => {
      const wrapper = mountScroller({ orientation: "horizontal" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("horizontal");
    });

    it("shows both scrollbars and corner when orientation='both'", () => {
      const wrapper = mountScroller({ orientation: "both" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(2);
      expect(wrapper.findComponent({ name: "ScrollAreaCorner" }).exists()).toBe(true);
    });
  });

  describe("scroll tracking", () => {
    const createViewportStub = () => {
      let scrollHandler: ((e: Event) => void) | null = null;
      const viewportEl = document.createElement("div");
      Object.defineProperty(viewportEl, "scrollTop", { value: 0, writable: true });
      viewportEl.addEventListener = vi.fn((event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === "scroll") scrollHandler = handler as (e: Event) => void;
      });
      viewportEl.removeEventListener = vi.fn();
      viewportEl.scrollTo = vi.fn();

      const ScrollAreaViewportStub = defineComponent({
        name: "ScrollAreaViewport",
        inheritAttrs: false,
        setup(_, { attrs, slots, expose }) {
          expose({ viewportElement: viewportEl });
          return () => h("div", { ...attrs }, slots.default?.());
        },
      });

      return { viewportEl, ScrollAreaViewportStub, getScrollHandler: () => scrollHandler };
    };

    const mountWithViewport = (props: Record<string, unknown> = {}) => {
      const { viewportEl, ScrollAreaViewportStub, getScrollHandler } = createViewportStub();
      const wrapper = mount(Scroller, {
        props: { ...props },
        global: {
          stubs: {
            ...oreStubs,
            ...rekaStubs("ScrollAreaRoot", "ScrollAreaScrollbar", "ScrollAreaThumb", "ScrollAreaCorner"),
            ScrollAreaViewport: ScrollAreaViewportStub,
          },
        },
      });
      return { wrapper, viewportEl, getScrollHandler };
    };

    it("attaches scroll listener on mount and tracks scrollY", async () => {
      const { wrapper, viewportEl, getScrollHandler } = mountWithViewport();
      const handler = getScrollHandler();
      expect(handler).not.toBeNull();

      Object.defineProperty(viewportEl, "scrollTop", { value: 150, writable: true });
      handler?.(new Event("scroll"));
      await nextTick();

      expect(wrapper.find(".f-scroller-back-to-top").exists()).toBe(true);
    });

    it("back-to-top button calls scrollTo top", async () => {
      const { wrapper, viewportEl, getScrollHandler } = mountWithViewport();
      const handler = getScrollHandler();

      Object.defineProperty(viewportEl, "scrollTop", { value: 100, writable: true });
      handler?.(new Event("scroll"));
      await nextTick();

      const backToTop = wrapper.find(".f-scroller-back-to-top");
      expect(backToTop.exists()).toBe(true);
      await backToTop.trigger("click");

      expect(viewportEl.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("back-to-top renders Icon and label", async () => {
      const { wrapper, viewportEl, getScrollHandler } = mountWithViewport();
      const handler = getScrollHandler();

      Object.defineProperty(viewportEl, "scrollTop", { value: 50, writable: true });
      handler?.(new Event("scroll"));
      await nextTick();

      const backToTop = wrapper.find(".f-scroller-back-to-top");
      expect(backToTop.find(".f-scroller-back-to-top-label").exists()).toBe(true);
    });

    it("does not show back-to-top when not scrolled", () => {
      const { wrapper } = mountWithViewport();
      expect(wrapper.find(".f-scroller-back-to-top").exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountScroller({ pt: { root: { props: { class: "custom" } } } });
      expect(wrapper.find(".f-scroller-root").classes()).toContain("custom");
    });
  });
});
