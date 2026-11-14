// The date grid wrapper: `prev` and `next` before the month controls.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import DateGrid from "../../../app/components/date-grid";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("date grid wrapper", () => {
  it("draws prev and next before the month controls", () => {
    const wrapper = mount(DateGrid, {
      props: { modelValue: undefined },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const prev = wrapper.get(".f-date-grid-prev");
    expect(prev.get("svg[data-icon]").attributes("data-icon")).toBe("prev");
    expect(prev.text()).toBe("Previous");
    expect(prev.element.firstElementChild?.tagName).toBe("svg");
    expect(
      wrapper.get(".f-date-grid-next svg[data-icon]").attributes("data-icon"),
    ).toBe("next");
  });
});
