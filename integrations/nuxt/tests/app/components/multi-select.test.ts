// The multi select wrapper: `expand` after the display, the layer's
// Checkbox behind each item's checkbox.
import type { Option } from "@zoobzio/vue/types/common";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import MultiSelect from "../../../app/components/multi-select";

const items: Option[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("multi select wrapper", () => {
  it("draws expand after the display and check in each item's checkbox", async () => {
    const wrapper = mount(MultiSelect<Option>, {
      props: { items, modelValue: [], open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    expect(
      wrapper
        .get("button.f-select-trigger")
        .element.lastElementChild?.getAttribute("data-icon"),
    ).toBe("expand");
    const checks = document.body.querySelectorAll(
      '[role="option"] .f-checkbox-root svg[data-icon="check"]',
    );
    expect(checks).toHaveLength(2);
  });
});
