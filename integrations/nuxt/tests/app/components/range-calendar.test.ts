// The range calendar wrapper: `prev` and `next` before the month controls.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RangeCalendar from "../../../app/components/range-calendar";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("range calendar wrapper", () => {
  it("draws prev and next before the month controls", () => {
    const wrapper = mount(RangeCalendar, {
      props: { modelValue: undefined },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper
        .get(".f-range-calendar-prev svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("prev");
    expect(
      wrapper
        .get(".f-range-calendar-next svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("next");
  });
});
