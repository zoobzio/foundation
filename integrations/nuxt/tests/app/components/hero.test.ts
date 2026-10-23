// The hero wrapper: NuxtLink under the action's `link` part.
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Hero from "../../../app/components/hero.vue";

describe("hero wrapper", () => {
  it("renders the action through NuxtLink with the recipe's href", () => {
    const wrapper = mount(Hero, {
      props: {
        tagline: "Build",
        action: { label: "Start", to: "/start", target: "_self" },
      },
    });
    const action = wrapper.get("a[data-nuxt]");
    expect(action.attributes("href")).toBe("/start");
    expect(action.attributes("target")).toBe("_self");
    expect(action.text()).toBe("Start");
  });

  it("renders a disabled action through NuxtLink without an href", () => {
    const wrapper = mount(Hero, {
      props: {
        tagline: "Build",
        action: { label: "Start", to: "/start", disabled: true },
      },
    });
    const action = wrapper.get("a[data-nuxt]");
    expect(action.classes()).toContain("f-anchor");
    expect(action.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link and forwards slots", () => {
    const wrapper = mount(Hero, {
      props: {
        tagline: "Build",
        action: { label: "Start", to: "/start" },
        pt: { link: { class: "custom" } },
      },
      slots: {
        tagline: `<template #tagline="{ tagline }"><em class="tag">{{ tagline }}!</em></template>`,
      },
    });
    expect(wrapper.get("a[data-nuxt]").classes()).toContain("custom");
    expect(wrapper.get("em.tag").text()).toBe("Build!");
  });
});
