// The date range grid wrapper: `prev` and `next` before the month controls.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import DateRangeGrid from "../../../app/components/date-range-grid";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("date range grid wrapper", () => {
  it("draws prev and next before the month controls", () => {
    const wrapper = mount(DateRangeGrid, {
      props: { modelValue: undefined },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper
        .get(".f-date-range-grid-prev svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("prev");
    expect(
      wrapper
        .get(".f-date-range-grid-next svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("next");
  });
});
