import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Anchor from "../../../../../../layers/ore/app/components/Anchor.vue";

const NuxtLinkStub = {
  template: "<a v-bind=\"$attrs\"><slot /></a>",
  props: ["to", "external", "target", "replace", "prefetch"],
};

describe("Anchor", () => {
  it("renders with f-a class", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").classes()).toContain("f-a");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    const a = wrapper.find("a");
    expect(a.attributes("data-variant")).toBe("outlined");
    expect(a.attributes("data-size")).toBe("sm");
    expect(a.attributes("data-color")).toBe("primary");
    expect(a.attributes("data-radius")).toBe("md");
    expect(a.attributes("data-density")).toBe("compact");
    expect(a.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", label: "Home" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").attributes("aria-label")).toBe("Home");
  });

  it("renders label as default slot text", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", label: "Home" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.text()).toBe("Home");
  });

  it("renders custom slot content", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/" },
      slots: { default: "Click here" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.text()).toBe("Click here");
  });

  it("passes to prop through when not disabled", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/about" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.findComponent(NuxtLinkStub).props("to")).toBe("/about");
  });

  it("does not set aria-current when not disabled and no ariaCurrent", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").attributes("aria-current")).toBeUndefined();
  });

  it("sets aria-disabled when disabled", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", disabled: true },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").attributes("aria-disabled")).toBe("true");
  });

  it("sets aria-current to 'page' when disabled and ariaCurrent explicitly undefined", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", disabled: true, ariaCurrent: undefined },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").attributes("aria-current")).toBe("page");
  });

  it("sets explicit ariaCurrent value when provided", () => {
    const wrapper = mount(Anchor, {
      props: { to: "/", ariaCurrent: "step" },
      global: { stubs: { NuxtLink: NuxtLinkStub } },
    });
    expect(wrapper.find("a").attributes("aria-current")).toBe("step");
  });
});
