import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "../../../../../../layers/ore/app/components/Label.vue";

describe("Label", () => {
  it("renders a label element with f-label class", () => {
    const wrapper = mount(Label);
    expect(wrapper.element.tagName).toBe("LABEL");
    expect(wrapper.classes()).toContain("f-label");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Label, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("renders default slot content", () => {
    const wrapper = mount(Label, { slots: { default: "Hello world" } });
    expect(wrapper.text()).toBe("Hello world");
  });
});
