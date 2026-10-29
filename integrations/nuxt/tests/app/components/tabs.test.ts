// The tabs wrapper: NuxtLink under the `link` part, the model relayed.
import type { TabsOption } from "@zoobzio/vue/types/components/tabs";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Tabs from "../../../app/components/tabs";

const tabs: TabsOption[] = [
  { value: "overview", label: "Overview", link: { to: "/overview" } },
  {
    value: "billing",
    label: "Billing",
    disabled: true,
    link: { to: "/billing" },
  },
  { value: "local", label: "Local" },
];

const mounted: { unmount: () => void }[] = [];

const mountTabs = (props: { pt?: object } = {}) => {
  const wrapper = mount(Tabs<TabsOption>, {
    props: { tabs, modelValue: "overview", ...props },
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
    .find((t) => t.text().includes(label));
  if (!found) throw new Error(`no rendered tab "${label}"`);
  return found;
};

describe("tabs wrapper", () => {
  it("renders a linked tab through NuxtLink and keeps the tab role on it", () => {
    const wrapper = mountTabs();
    const overview = tabByText(wrapper, "Overview");
    expect(overview.attributes("data-nuxt")).toBe("");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.attributes("aria-selected")).toBe("true");
    expect(tabByText(wrapper, "Local").attributes("data-nuxt")).toBeUndefined();
  });

  it("renders a disabled linked tab through NuxtLink without an href", () => {
    const wrapper = mountTabs();
    const billing = tabByText(wrapper, "Billing");
    expect(billing.attributes("data-nuxt")).toBe("");
    expect(billing.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link and relays the model", async () => {
    const wrapper = mountTabs({ pt: { link: () => ({ class: "custom" }) } });
    expect(tabByText(wrapper, "Overview").classes()).toContain("custom");
    await tabByText(wrapper, "Local").trigger("mousedown", { button: 0 });
    await tabByText(wrapper, "Local").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["local"]);
  });
});
