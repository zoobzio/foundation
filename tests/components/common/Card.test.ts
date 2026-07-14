import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Card from "#foundation/components/common/Card.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Card, { props, slots });

describe("Card", () => {
  it("renders a div element with f-card class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-card");
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
    const wrapper = factory({ label: "My Card" });
    expect(wrapper.attributes("aria-label")).toBe("My Card");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Card" });
    expect(wrapper.text()).toBe("My Card");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Card" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
