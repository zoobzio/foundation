import { afterEach, describe, expect, it } from "vitest";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../src/components/segmented-control.vue";
import { fakeLinkedOptions } from "#test/data/options";
import type {
  SegmentedControlEmits,
  SegmentedControlOption,
  SegmentedControlProps,
} from "../../src/types/components/segmented-control";
import { RouterLink } from "#test/mount/link";

// A concrete FunctionalComponent type instantiates T for mount().
const SegmentedControl: FunctionalComponent<
  SegmentedControlProps<SegmentedControlOption>,
  SegmentedControlEmits
> = Core;

const mounted: { unmount: () => void }[] = [];

const mountControl = (
  props: Partial<SegmentedControlProps<SegmentedControlOption>> = {},
) => {
  const wrapper = mount(SegmentedControl, {
    props: { options: fakeLinkedOptions, modelValue: "overview", ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const segmentByText = (
  wrapper: ReturnType<typeof mountControl>,
  label: string,
) => {
  const found = wrapper
    .findAll(".f-toggle-group-item")
    .find((segment) => segment.text() === label);
  if (!found) throw new Error(`no rendered segment "${label}"`);
  return found;
};

describe("segmented-control", () => {
  it("linked segments render as the toggle anchor itself", () => {
    const wrapper = mountControl();
    const overview = segmentByText(wrapper, "Overview");
    expect(overview.element.tagName).toBe("A");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.attributes("type")).toBeUndefined();
    expect(overview.attributes("aria-pressed")).toBe("true");
    expect(overview.find("a").exists()).toBe(false);
  });

  it("plain segments stay buttons alongside linked ones", () => {
    const wrapper = mountControl();
    expect(segmentByText(wrapper, "Local").element.tagName).toBe("BUTTON");
  });

  it("disabled linked segments drop their href", () => {
    const wrapper = mountControl();
    const billing = segmentByText(wrapper, "Billing");
    expect(billing.element.tagName).toBe("A");
    expect(billing.attributes("href")).toBeUndefined();
  });

  it("clicking a linked segment still updates the model", async () => {
    const wrapper = mountControl();
    await segmentByText(wrapper, "Activity").trigger("click");
    await flushPromises();
    expect(wrapper.emitted("update:modelValue")).toEqual([["activity"]]);
  });
});

describe("segmented control link part", () => {
  it("pt.link swaps the item anchor and keeps the toggle state on it", () => {
    const wrapper = mountControl({ pt: { link: () => ({ as: RouterLink }) } });
    const overview = wrapper.get("a[data-router]");
    expect(overview.attributes("href")).toBe("/overview");
    expect(overview.classes()).toContain("f-toggle-group-item");
    expect(overview.attributes("data-state")).toBe("on");
  });
});
