// Core component test in the select.test.ts mold: reka renders real DOM.
// NuxtLink is imported from #components, stubbed to a bare <a> that maps
// `to` → `href`.
import { afterEach, describe, expect, it } from "vitest";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../../../app/components/core/segmented-control.vue";
import { fakeLinkedOptions } from "#test/data/options";
import type {
  SegmentedControlEmits,
  SegmentedControlOption,
  SegmentedControlProps,
} from "../../../../app/types/core/segmented-control";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
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
