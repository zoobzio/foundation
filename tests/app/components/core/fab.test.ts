// Fab's own logic: the label doubles as the accessible name and as the
// visible fallback when no icon slot is supplied, and the click re-emit.
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Fab from "../../../../app/components/core/fab.vue";

describe("fab", () => {
  it("renders its label as visible text when no icon slot is supplied", () => {
    const wrapper = mount(Fab, { props: { label: "Refresh" } });
    const button = wrapper.get("button");
    expect(button.attributes("aria-label")).toBe("Refresh");
    expect(button.get(".f-span").text()).toBe("Refresh");
  });

  it("a supplied icon slot replaces the label text, keeping the aria-label", () => {
    const wrapper = mount(Fab, {
      props: { label: "Refresh" },
      slots: {
        icon: `<template #icon="ctx"><i>{{ ctx.label }}</i></template>`,
      },
    });
    const button = wrapper.get("button");
    expect(button.attributes("aria-label")).toBe("Refresh");
    expect(button.get("i").text()).toBe("Refresh");
    expect(button.find(".f-span").exists()).toBe(false);
  });

  it("renders neither text nor aria-label without a label", () => {
    const wrapper = mount(Fab);
    const button = wrapper.get("button");
    expect(button.attributes("aria-label")).toBeUndefined();
    expect(button.text()).toBe("");
  });

  it("renders the badge only when one is set", () => {
    const bare = mount(Fab, { props: { label: "Search" } });
    expect(bare.find(".f-group").exists()).toBe(false);
    const badged = mount(Fab, { props: { label: "Search", badge: 3 } });
    expect(badged.get(".f-group").text()).toBe("3");
  });

  it("re-emits click", async () => {
    const wrapper = mount(Fab, { props: { label: "Go" } });
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
