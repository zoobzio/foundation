// The date filters wrapper: `calendar` as the trigger's content, the
// layer's Command behind the field step.
import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import DateFilters from "../../../app/components/date-filters";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("date filters wrapper", () => {
  it("draws calendar as the trigger's content, keeping its label as the name", async () => {
    const wrapper = mount(DateFilters, {
      props: {
        fields: [{ key: "created", label: "Created" }],
        addFilter: vi.fn(),
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const trigger = wrapper.get('button[aria-label="Dates"]');
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
      "calendar",
    );
    expect(trigger.text()).toBe("");
    await trigger.trigger("click");
    await flushPromises();
    const filter = document.body.querySelector(".f-listbox-filter");
    expect(filter?.previousElementSibling?.getAttribute("data-icon")).toBe(
      "search",
    );
  });
});
