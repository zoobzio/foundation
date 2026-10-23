import { afterEach, describe, expect, it } from "vitest";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../src/components/tabs.vue";
import { fakeLinkedOptions, fakeOptions } from "#test/data/options";
import type {
  TabsEmits,
  TabsOption,
  TabsProps,
} from "../../src/types/components/tabs";
import { RouterLink } from "#test/mount/link";

// A concrete FunctionalComponent type instantiates T for mount().
const Tabs: FunctionalComponent<TabsProps<TabsOption>, TabsEmits> = Core;

const mounted: { unmount: () => void }[] = [];

const mountTabs = (props: Partial<TabsProps<TabsOption>> = {}) => {
  const wrapper = mount(Tabs, {
    props: { tabs: fakeLinkedOptions, modelValue: "overview", ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const tabByText = (wrapper: ReturnType<typeof mountTabs>, label: string) => {
  const found = wrapper
    .findAll('[role="tab"]')
    .find((tab) => tab.text() === label);
  if (!found) throw new Error(`no rendered tab "${label}"`);
  return found;
};

describe("tabs", () => {
  it("linked tabs render as the tab anchor itself", () => {
    const wrapper = mountTabs();
    const overview = tabByText(wrapper, "Overview");
    expect(overview.element.tagName).toBe("A");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.attributes("type")).toBeUndefined();
    expect(overview.classes()).toContain("f-tabs-trigger");
    expect(overview.attributes("aria-selected")).toBe("true");
    expect(overview.find("a").exists()).toBe(false);
  });

  it("plain tabs stay buttons alongside linked ones", () => {
    const wrapper = mountTabs();
    const local = tabByText(wrapper, "Local");
    expect(local.element.tagName).toBe("BUTTON");
    expect(local.attributes("type")).toBe("button");
  });

  it("disabled linked tabs drop their href", () => {
    const wrapper = mountTabs();
    const billing = tabByText(wrapper, "Billing");
    expect(billing.element.tagName).toBe("A");
    expect(billing.attributes("href")).toBeUndefined();
  });

  it("any linked tab makes focus inert: only activation changes the model", async () => {
    const wrapper = mountTabs();
    await tabByText(wrapper, "Activity").trigger("focus");
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    await tabByText(wrapper, "Activity").trigger("mousedown", {
      button: 0,
      ctrlKey: false,
    });
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")).toEqual([["activity"]]);
  });

  it("without links, focus activates as before", async () => {
    const wrapper = mountTabs({ tabs: fakeOptions, modelValue: "apple" });
    await tabByText(wrapper, "Banana").trigger("focus");
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")).toEqual([["banana"]]);
  });
});

describe("tabs link part", () => {
  it("pt.link swaps the trigger anchor and keeps the tab role on it", () => {
    const wrapper = mountTabs({ pt: { link: () => ({ as: RouterLink }) } });
    const overview = tabByText(wrapper, "Overview");
    expect(overview.attributes("data-router")).toBe("");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.classes()).toContain("f-tabs-trigger");
    expect(overview.attributes("aria-selected")).toBe("true");
    expect(
      tabByText(wrapper, "Local").attributes("data-router"),
    ).toBeUndefined();
  });
});
