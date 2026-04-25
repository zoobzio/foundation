import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Main from "../../../../../../layers/ore/app/components/Main.vue";

describe("Main", () => {
  it("renders a main element with f-main class", () => {
    const wrapper = mount(Main);
    expect(wrapper.element.tagName).toBe("MAIN");
    expect(wrapper.classes()).toContain("f-main");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Main, {
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
    const wrapper = mount(Main, { props: { label: "My Main" } });
    expect(wrapper.attributes("aria-label")).toBe("My Main");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Main, { props: { label: "My Main" } });
    expect(wrapper.text()).toBe("My Main");
  });

  it("renders custom slot content over label", () => {
    const wrapper = mount(Main, {
      props: { label: "My Main" },
      slots: { default: "Custom content" },
    });
    expect(wrapper.text()).toBe("Custom content");
  });
});
