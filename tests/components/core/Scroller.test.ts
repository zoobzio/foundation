import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { mountScroller } from "#test/support/fixtures/components";
import { commonStubs, rekaStubs } from "#test/stubs";
import Scroller from "#foundation/components/core/scroller.vue";

// Core tests stub the tier below: the scroll-area wrappers are replaced by
// their reka names and the common components (Button/Icon/Span) by name, so
// assertions target the stubs' bound props/attrs.
describe("Scroller", () => {
  describe("static", () => {
    const wrapper = mountScroller();

    it("renders the root wrapper part", () => {
      expect(wrapper.findComponent({ name: "ScrollAreaRoot" }).exists()).toBe(true);
    });

    it("shows a single vertical scrollbar by default", () => {
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("vertical");
    });
  });

  describe("conditional", () => {
    it("shows a horizontal scrollbar when orientation='horizontal'", () => {
      const wrapper = mountScroller({ orientation: "horizontal" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(1);
      expect(scrollbars[0].attributes("orientation")).toBe("horizontal");
    });

    it("shows both scrollbars and the corner when orientation='both'", () => {
      const wrapper = mountScroller({ orientation: "both" });
      const scrollbars = wrapper.findAllComponents({ name: "ScrollAreaScrollbar" });
      expect(scrollbars).toHaveLength(2);
      expect(wrapper.findComponent({ name: "ScrollAreaCorner" }).exists()).toBe(true);
    });
  });

  describe("scroll tracking", () => {
    // The core reaches the viewport DOM through the wrapper instance's `$el`.
    // A minimal stub renders a real div so its rendered element *is* that
    // `$el`, letting the test drive real scroll events against it.
    const ViewportStub = defineComponent({
      name: "ScrollAreaViewport",
      setup(_, { slots }) {
        return () => h("div", {}, slots.default?.());
      },
    });

    const mountWithViewport = (props: Record<string, unknown> = {}) => {
      const wrapper = mount(Scroller, {
        props: { ...props },
        global: {
          stubs: {
            ...commonStubs,
            ...rekaStubs("ScrollAreaRoot", "ScrollAreaScrollbar", "ScrollAreaThumb", "ScrollAreaCorner"),
            ScrollAreaViewport: ViewportStub,
          },
        },
      });
      const viewportEl = wrapper.findComponent({ name: "ScrollAreaViewport" }).element;
      return { wrapper, viewportEl };
    };

    it("tracks scroll position and reveals the back-to-top button", async () => {
      const { wrapper, viewportEl } = mountWithViewport();
      expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(false);

      Object.defineProperty(viewportEl, "scrollTop", { value: 150, configurable: true });
      viewportEl.dispatchEvent(new Event("scroll"));
      await nextTick();

      expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(true);
    });

    it("back-to-top click scrolls the viewport to top", async () => {
      const { wrapper, viewportEl } = mountWithViewport();
      const scrollTo = vi.fn();
      viewportEl.scrollTo = scrollTo;

      Object.defineProperty(viewportEl, "scrollTop", { value: 100, configurable: true });
      viewportEl.dispatchEvent(new Event("scroll"));
      await nextTick();

      const button = wrapper.findComponent({ name: "Button" });
      expect(button.exists()).toBe(true);
      await button.trigger("click");

      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("renders the icon and label inside back-to-top", async () => {
      const { wrapper, viewportEl } = mountWithViewport();

      Object.defineProperty(viewportEl, "scrollTop", { value: 50, configurable: true });
      viewportEl.dispatchEvent(new Event("scroll"));
      await nextTick();

      expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "Span" }).exists()).toBe(true);
    });

    it("does not show back-to-top when not scrolled", () => {
      const { wrapper } = mountWithViewport();
      expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(false);
    });
  });

  describe("passthrough", () => {
    it("pt.root flat-merges onto the root wrapper", () => {
      const wrapper = mountScroller({ pt: { root: { class: "custom" } } });
      expect(wrapper.findComponent({ name: "ScrollAreaRoot" }).classes()).toContain("custom");
    });
  });

  describe("slots", () => {
    it("default slot renders inside the viewport part", () => {
      const wrapper = mountScroller({}, { default: "<p class=\"body\">Body</p>" });
      expect(wrapper.find("p.body").text()).toBe("Body");
    });

    it("backToTop slot overrides the default button", () => {
      const wrapper = mountScroller({}, { backToTop: "<div class=\"custom-btt\"></div>" });
      expect(wrapper.find(".custom-btt").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(false);
    });
  });
});
