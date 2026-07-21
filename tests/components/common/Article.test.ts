import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Article from "#foundation/components/common/Article.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Article, { props, slots });

describe("Article", () => {
  it("renders an article element with f-article class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("ARTICLE");
    expect(wrapper.classes()).toContain("f-article");
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
