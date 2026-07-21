import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Anchor from "#foundation/components/common/Anchor.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Anchor, { props: { to: "/", ...props }, slots, global: { stubs: { NuxtLink: { template: '<a v-bind=""><slot /></a>' } } } });

describe("Anchor", () => {
  it("renders with f-a class", () => {
    const wrapper = factory();
    expect(wrapper.find("a").classes()).toContain("f-a");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = factory({ label: "Home" });
    expect(wrapper.find("a").attributes("aria-label")).toBe("Home");
  });

  it("renders label as default slot text", () => {
    const wrapper = factory({ label: "Home" });
    expect(wrapper.text()).toBe("Home");
  });

  it("renders custom slot content", () => {
    const wrapper = factory({}, { default: "Click here" });
    expect(wrapper.text()).toBe("Click here");
  });

  it("passes to prop through when not disabled", () => {
    const wrapper = factory({ to: "/about" });
    expect(wrapper.find("a").attributes("to")).toBe("/about");
  });

  it("does not set aria-current when not disabled and no ariaCurrent", () => {
    const wrapper = factory();
    expect(wrapper.find("a").attributes("aria-current")).toBeUndefined();
  });

  it("sets aria-disabled when disabled", () => {
    const wrapper = factory({ disabled: true });
    expect(wrapper.find("a").attributes("aria-disabled")).toBe("true");
  });

  it("sets aria-current to 'page' when disabled and ariaCurrent explicitly undefined", () => {
    const wrapper = factory({ disabled: true, ariaCurrent: undefined });
    expect(wrapper.find("a").attributes("aria-current")).toBe("page");
  });

  it("sets explicit ariaCurrent value when provided", () => {
    const wrapper = factory({ ariaCurrent: "step" });
    expect(wrapper.find("a").attributes("aria-current")).toBe("step");
  });

  it("sets external attribute", () => {
    const wrapper = factory({ external: true });
    expect(wrapper.find("a").attributes("external")).toBe("true");
  });

  it("sets target attribute", () => {
    const wrapper = factory({ target: "_blank" });
    expect(wrapper.find("a").attributes("target")).toBe("_blank");
  });

  it("sets replace attribute", () => {
    const wrapper = factory({ replace: true });
    expect(wrapper.find("a").attributes("replace")).toBe("true");
  });

  it("sets prefetch attribute", () => {
    const wrapper = factory({ prefetch: true });
    expect(wrapper.find("a").attributes("prefetch")).toBe("true");
  });

  it("clears to when disabled", () => {
    const wrapper = factory({ to: "/about", disabled: true });
    expect(wrapper.find("a").attributes("to")).toBeUndefined();
  });
});
