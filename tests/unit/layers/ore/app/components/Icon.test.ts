import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Icon from "../../../../../../layers/ore/app/components/Icon.vue";

describe("Icon", () => {
  it("renders i element with f-icon class", () => {
    const wrapper = mount(Icon, { props: { alias: "home" } });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.classes()).toContain("f-icon");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Icon, {
      props: { alias: "home", variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("applies mask styles when useIconAlias returns mode 'mask'", () => {
    const wrapper = mount(Icon, { props: { alias: "home" } });
    const style = wrapper.attributes("style") ?? "";
    // happy-dom drops mask-* and -webkit-mask-* properties but preserves background-color
    expect(style).toContain("background-color: currentcolor");
  });

  it("falls back to warning icon when alias is not found", () => {
    const original = globalThis.useIconAlias;
    globalThis.useIconAlias = (alias: string) => (alias === "warning" ? { uri: "/__mocked__/warning.svg", mode: "mask" } : null);
    const wrapper = mount(Icon, { props: { alias: "nonexistent" } });
    const style = wrapper.attributes("style") ?? "";
    expect(style).toContain("background-color: currentcolor");
    globalThis.useIconAlias = original;
  });

  it("applies background styles when useIconAlias returns non-mask mode", () => {
    const original = globalThis.useIconAlias;
    globalThis.useIconAlias = (alias: string) => ({
      uri: `/__mocked__/${alias}.svg`,
      mode: "bg",
    });
    const wrapper = mount(Icon, { props: { alias: "home" } });
    const style = wrapper.attributes("style") ?? "";
    expect(style).not.toContain("background-color");
    expect(style).toContain("background-image");
    expect(style).toContain("/__mocked__/home.svg");
    globalThis.useIconAlias = original;
  });

  it("sets aria-hidden when no label is provided", () => {
    const wrapper = mount(Icon, { props: { alias: "home" } });
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("sets aria-label and role='img' when label is provided", () => {
    const wrapper = mount(Icon, { props: { alias: "home", label: "Home icon" } });
    expect(wrapper.attributes("aria-label")).toBe("Home icon");
    expect(wrapper.attributes("role")).toBe("img");
  });

  it("does not set role when no label", () => {
    const wrapper = mount(Icon, { props: { alias: "home" } });
    expect(wrapper.attributes("role")).toBeUndefined();
  });
});
