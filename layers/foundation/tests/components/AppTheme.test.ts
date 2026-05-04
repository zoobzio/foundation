import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { oreStubs, alloyStubs } from "@zoobz-io/alloy/stubs";

const AppTheme = (await import("../../app/components/App/Theme.vue")).default as DefineComponent;

const stubs = { ...oreStubs, ...alloyStubs };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(AppTheme, {
    props,
    slots,
    global: { stubs },
  });

describe("AppTheme", () => {
  it("renders root with f-app-theme class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-theme").exists()).toBe(true);
  });

  it("renders a Fab trigger by default", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-theme-trigger").exists()).toBe(true);
  });

  it("renders a Dialog", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-theme-dialog").exists()).toBe(true);
  });

  it("renders a Command inside the dialog", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-theme-command").exists()).toBe(true);
  });

  it("passes placeholder to Command", () => {
    const wrapper = factory();
    const command = wrapper.find(".f-app-theme-command");
    expect(command.attributes("placeholder")).toBe("Search themes...");
  });

  it("opens dialog when trigger is clicked", async () => {
    const wrapper = factory();
    const dialog = wrapper.find(".f-app-theme-dialog");
    expect(dialog.attributes("open")).toBe("false");
    await wrapper.find(".f-app-theme-trigger").trigger("click");
    expect(dialog.attributes("open")).toBe("true");
  });

  it("renders custom trigger slot", () => {
    const wrapper = factory({}, { trigger: "<button class='custom-trigger'>Pick</button>" });
    expect(wrapper.find(".custom-trigger").exists()).toBe(true);
    expect(wrapper.find(".f-app-theme-trigger").exists()).toBe(false);
  });
});
