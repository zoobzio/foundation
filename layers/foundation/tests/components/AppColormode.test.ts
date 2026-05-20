import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { oreStubs, alloyStubs } from "@zoobz-io/alloy/stubs";

const AppColormode = (await import("../../app/components/App/Colormode.vue")).default as DefineComponent;

const stubs = { ...oreStubs, ...alloyStubs };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(AppColormode, {
    props,
    slots,
    global: { stubs },
  });

beforeEach(() => {
  useTheme().mode.value = "dark";
});

describe("AppColormode", () => {
  it("renders root with f-app-colormode class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-colormode").exists()).toBe(true);
  });

  it("renders a Fab trigger by default", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-colormode-trigger").exists()).toBe(true);
  });

  it("shows dark icon when mode is dark", () => {
    const wrapper = factory();
    const fab = wrapper.find(".f-app-colormode-trigger");
    expect(fab.attributes("icon")).toBe("dark");
  });

  it("toggles to light on click", async () => {
    const wrapper = factory();
    await wrapper.find(".f-app-colormode-trigger").trigger("click");
    const fab = wrapper.find(".f-app-colormode-trigger");
    expect(fab.attributes("icon")).toBe("light");
  });

  it("toggles back to dark on second click", async () => {
    const wrapper = factory();
    await wrapper.find(".f-app-colormode-trigger").trigger("click");
    await wrapper.find(".f-app-colormode-trigger").trigger("click");
    const fab = wrapper.find(".f-app-colormode-trigger");
    expect(fab.attributes("icon")).toBe("dark");
  });

  it("renders custom trigger slot", () => {
    const wrapper = factory({}, { trigger: "<button class='custom-toggle'>Toggle</button>" });
    expect(wrapper.find(".custom-toggle").exists()).toBe(true);
    expect(wrapper.find(".f-app-colormode-trigger").exists()).toBe(false);
  });
});
