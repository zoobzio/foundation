import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { oreStubs, alloyStubs } from "@zoobz-io/alloy/stubs";

const AppLocale = (await import("../../app/components/App/Locale.vue")).default as DefineComponent;

const stubs = { ...oreStubs, ...alloyStubs };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(AppLocale, {
    props,
    slots,
    global: { stubs },
  });

beforeEach(() => {
  useRosetta().locale.value = "en";
});

describe("AppLocale", () => {
  it("renders root with f-app-locale class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-locale").exists()).toBe(true);
  });

  it("renders a Fab trigger by default", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-locale-trigger").exists()).toBe(true);
  });

  it("renders a Dialog", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-locale-dialog").exists()).toBe(true);
  });

  it("renders a Command inside the dialog", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-locale-command").exists()).toBe(true);
  });

  it("passes locale placeholder to Command", () => {
    const wrapper = factory();
    const command = wrapper.find(".f-app-locale-command");
    expect(command.attributes("placeholder")).toBe("Search languages...");
  });

  it("opens dialog when trigger is clicked", async () => {
    const wrapper = factory();
    const dialog = wrapper.find(".f-app-locale-dialog");
    expect(dialog.attributes("open")).toBe("false");
    await wrapper.find(".f-app-locale-trigger").trigger("click");
    expect(dialog.attributes("open")).toBe("true");
  });

  it("renders custom trigger slot", () => {
    const wrapper = factory({}, { trigger: "<button class='custom-trigger'>Lang</button>" });
    expect(wrapper.find(".custom-trigger").exists()).toBe(true);
    expect(wrapper.find(".f-app-locale-trigger").exists()).toBe(false);
  });
});
