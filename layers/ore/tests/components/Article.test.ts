import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Article from "../../app/components/Article.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Article, { props, slots });

describe("Article", () => {
  it("renders an article element with f-article class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("ARTICLE");
    expect(wrapper.classes()).toContain("f-article");
  });

  it("binds modifier data attributes", () => {
    const wrapper = factory({ variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "My Article" });
    expect(wrapper.attributes("aria-label")).toBe("My Article");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Article" });
    expect(wrapper.text()).toBe("My Article");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Article" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
