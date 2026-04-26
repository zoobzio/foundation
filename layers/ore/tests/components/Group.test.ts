import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Group from "../../app/components/Group.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Group, { props, slots });

describe("Group", () => {
  it("renders a div element with f-group class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-group");
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
    const wrapper = factory({ label: "My Group" });
    expect(wrapper.attributes("aria-label")).toBe("My Group");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "My Group" });
    expect(wrapper.text()).toBe("My Group");
  });

  it("renders custom slot content over label", () => {
    const wrapper = factory({ label: "My Group" }, { default: "Custom content" });
    expect(wrapper.text()).toBe("Custom content");
  });
});
