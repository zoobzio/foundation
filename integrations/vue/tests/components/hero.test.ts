import type { HeroProps } from "../../src/types/components/hero";

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Hero from "../../src/components/hero.vue";
import { RouterLink } from "#test/mount/link";

const mountHero = (
  props: Partial<HeroProps> = {},
  slots: Record<string, string> = {},
) =>
  mount(Hero, {
    props: { tagline: "Build faster", ...props },
    slots,
  });

describe("hero", () => {
  it("renders the action as an anchor over its link", () => {
    const wrapper = mountHero({
      action: { label: "Get started", to: "/start", target: "_blank" },
    });
    const link = wrapper.get("a.f-anchor");
    expect(link.text()).toBe("Get started");
    expect(link.attributes("href")).toBe("/start");
    expect(link.attributes("target")).toBe("_blank");
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("drops the href of a disabled action", () => {
    const wrapper = mountHero({
      action: { label: "Soon", to: "/soon", disabled: true },
    });
    expect(wrapper.get("a.f-anchor").attributes("href")).toBeUndefined();
  });

  it("renders no action without one", () => {
    expect(mountHero().find("a").exists()).toBe(false);
  });

  it("pt.link swaps the anchor for a component that keeps its attributes", () => {
    const wrapper = mountHero({
      action: { label: "Get started", to: "/start" },
      pt: { link: { as: RouterLink } },
    });
    const link = wrapper.get("a[data-router]");
    expect(link.attributes("href")).toBe("/start");
    expect(link.classes()).toContain("f-anchor");
  });

  it("the action slot replaces the anchor and receives the context", () => {
    const wrapper = mountHero(
      { action: { label: "Get started", to: "/start" } },
      {
        action: `<template #action="{ action }"><i>{{ action.label }}</i></template>`,
      },
    );
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.get("i").text()).toBe("Get started");
  });
});
