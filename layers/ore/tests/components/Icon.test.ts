import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Icon from "../../app/components/Icon.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Icon, { props: { alias: "home", ...props } });

describe("Icon", () => {
  it("renders svg element with f-icon class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("svg");
    expect(wrapper.classes()).toContain("f-icon");
  });

  it("renders use element with correct href", () => {
    const wrapper = factory({ alias: "home" });
    const use = wrapper.find("use");
    expect(use.exists()).toBe(true);
    expect(use.attributes("href")).toBe("/icons.svg#home");
  });

  it("sets fill to currentColor", () => {
    const wrapper = factory();
    expect(wrapper.attributes("fill")).toBe("currentColor");
  });

  it("binds modifier data attributes", () => {
    const wrapper = factory({
      alias: "home",
      variant: "outlined",
      size: "sm",
      color: "primary",
      radius: "md",
      density: "compact",
      elevation: "sm",
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("sets aria-hidden when no label is provided", () => {
    const wrapper = factory();
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("sets aria-label and role='img' when label is provided", () => {
    const wrapper = factory({ alias: "home", label: "Home icon" });
    expect(wrapper.attributes("aria-label")).toBe("Home icon");
    expect(wrapper.attributes("role")).toBe("img");
  });

  it("does not set role when no label", () => {
    const wrapper = factory();
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("updates href when alias changes", async () => {
    const wrapper = factory({ alias: "home" });
    await wrapper.setProps({ alias: "star" });
    const use = wrapper.find("use");
    expect(use.attributes("href")).toBe("/icons.svg#star");
  });
});
