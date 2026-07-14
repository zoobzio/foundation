import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "#foundation/components/common/Label.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Label, { props, slots });

describe("Label", () => {
  it("renders a label element with f-label class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("LABEL");
    expect(wrapper.classes()).toContain("f-label");
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

  it("renders default slot content", () => {
    const wrapper = factory({}, { default: "Hello world" });
    expect(wrapper.text()).toBe("Hello world");
  });

  it("sets for attribute", () => {
    const wrapper = factory({ for: "email-input" });
    expect(wrapper.attributes("for")).toBe("email-input");
  });

  it("does not set for attribute when not provided", () => {
    const wrapper = factory();
    expect(wrapper.attributes("for")).toBeUndefined();
  });
});
