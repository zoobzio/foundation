import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import type { DefineComponent } from "vue";
import { oreStubs, alloyStubs } from "@zoobz-io/alloy/stubs";

const AppAuth = (await import("../../app/components/App/Auth.vue")).default as DefineComponent;

const stubs = { ...oreStubs, ...alloyStubs };

const factory = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  shallowMount(AppAuth, {
    props,
    slots,
    global: { stubs },
  });

beforeEach(() => {
  useAuth().user.value = null;
});

describe("AppAuth", () => {
  it("renders root with f-app-auth class", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-auth").exists()).toBe(true);
  });

  it("renders a Fab trigger by default", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-auth-trigger").exists()).toBe(true);
  });

  it("shows lock icon when not authenticated", () => {
    const wrapper = factory();
    expect(wrapper.find(".f-app-auth-trigger").attributes("icon")).toBe("lock");
  });

  it("shows user icon when authenticated", () => {
    useAuth().user.value = { id: "1" };
    const wrapper = factory();
    expect(wrapper.find(".f-app-auth-trigger").attributes("icon")).toBe("user");
  });

  it("renders custom trigger slot", () => {
    const wrapper = factory({}, { trigger: "<button class='custom-auth'>Auth</button>" });
    expect(wrapper.find(".custom-auth").exists()).toBe(true);
    expect(wrapper.find(".f-app-auth-trigger").exists()).toBe(false);
  });
});
