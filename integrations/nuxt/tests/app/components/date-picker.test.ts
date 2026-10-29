// The date picker wrapper: `calendar` before the trigger label, `prev` and
// `next` before the month controls.
import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import DatePicker from "../../../app/components/date-picker";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("date picker wrapper", () => {
  it("draws calendar before the trigger label and prev and next in the content", async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: undefined, open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const trigger = wrapper.get(".f-date-picker-trigger");
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
      "calendar",
    );
    expect(trigger.text()).toBe("Calendar");
    expect(
      document.body
        .querySelector('button[aria-label="Previous page"] svg[data-icon]')
        ?.getAttribute("data-icon"),
    ).toBe("prev");
    expect(
      document.body
        .querySelector('button[aria-label="Next page"] svg[data-icon]')
        ?.getAttribute("data-icon"),
    ).toBe("next");
  });
});
