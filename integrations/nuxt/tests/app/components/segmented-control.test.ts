// The segmented control wrapper: NuxtLink under the `link` part, the
// model relayed.
import type { SegmentedControlOption } from "@zoobzio/vue/types/components/segmented-control";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SegmentedControl from "../../../app/components/segmented-control";

const options: SegmentedControlOption[] = [
  { value: "overview", label: "Overview", link: { to: "/overview" } },
  {
    value: "billing",
    label: "Billing",
    disabled: true,
    link: { to: "/billing" },
  },
  { value: "local", label: "Local", icon: "folder" },
];

const mounted: { unmount: () => void }[] = [];

const mountControl = (props: { pt?: object } = {}) => {
  const wrapper = mount(SegmentedControl<SegmentedControlOption>, {
    props: { options, modelValue: "overview", ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("segmented control wrapper", () => {
  it("draws an option's icon before its label", () => {
    const wrapper = mountControl();
    const icons = wrapper.findAll("svg[data-icon]");
    expect(icons.map((i) => i.attributes("data-icon"))).toEqual(["folder"]);
    expect(icons[0]?.element.parentElement?.textContent).toContain("Local");
  });

  it("renders a linked item through NuxtLink and keeps the toggle state", () => {
    const wrapper = mountControl();
    const overview = wrapper.get("a[data-nuxt]");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.attributes("data-state")).toBe("on");
  });

  it("renders a disabled linked item through NuxtLink without an href", () => {
    const wrapper = mountControl();
    const billing = wrapper
      .findAll("a")
      .find((a) => a.text().includes("Billing"));
    expect(billing?.attributes("data-nuxt")).toBe("");
    expect(billing?.attributes("href")).toBeUndefined();
  });

  it("composes a consumer's pt.link and relays the model", async () => {
    const wrapper = mountControl({ pt: { link: () => ({ class: "custom" }) } });
    expect(wrapper.get("a[data-nuxt]").classes()).toContain("custom");
    const local = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Local"));
    await local?.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["local"]);
  });
});
