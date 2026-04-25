import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Chip from "../../../../../../layers/ore/app/components/Chip.vue";

describe("Chip", () => {
  it("renders button with f-chip class and type='button'", () => {
    const wrapper = mount(Chip, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("f-chip");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Chip, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Chip, {
      props: { label: "Tag" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("aria-label")).toBe("Tag");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Chip, {
      props: { label: "Tag" },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.text()).toBe("Tag");
  });

  it("sets disabled attribute", () => {
    const wrapper = mount(Chip, {
      props: { disabled: true },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("binds ariaPressed", () => {
    const wrapper = mount(Chip, {
      props: { ariaPressed: true },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("aria-pressed")).toBe("true");
  });

  it("binds ariaSelected", () => {
    const wrapper = mount(Chip, {
      props: { ariaSelected: true },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("aria-selected")).toBe("true");
  });

  it("renders close Icon when closable is true", () => {
    const wrapper = mount(Chip, {
      props: { closable: true },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("does not render close Icon when closable is false", () => {
    const wrapper = mount(Chip, {
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
  });

  it("sets data-closable attribute when closable is true", () => {
    const wrapper = mount(Chip, {
      props: { closable: true },
      global: { stubs: { Icon: true } },
    });
    expect(wrapper.attributes("data-closable")).toBe("true");
  });
});
