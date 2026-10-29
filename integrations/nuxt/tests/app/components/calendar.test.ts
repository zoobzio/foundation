// The calendar wrapper: `prev` and `next` before the month controls.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Calendar from "../../../app/components/calendar";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("calendar wrapper", () => {
  it("draws prev and next before the month controls", () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: undefined },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const prev = wrapper.get(".f-calendar-prev");
    expect(prev.get("svg[data-icon]").attributes("data-icon")).toBe("prev");
    expect(prev.text()).toBe("Previous");
    expect(prev.element.firstElementChild?.tagName).toBe("svg");
    expect(
      wrapper.get(".f-calendar-next svg[data-icon]").attributes("data-icon"),
    ).toBe("next");
  });
});
