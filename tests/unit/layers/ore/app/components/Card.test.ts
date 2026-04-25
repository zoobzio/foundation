import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Card from "../../../../../../layers/ore/app/components/Card.vue";

describe("Card", () => {
  it("renders a div element with f-card class", () => {
    const wrapper = mount(Card);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-card");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Card, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Card, { props: { label: "My Card" } });
    expect(wrapper.attributes("aria-label")).toBe("My Card");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Card, { props: { label: "My Card" } });
    expect(wrapper.text()).toBe("My Card");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Card, {
      props: { label: "My Card" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });
});
