import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Prev from "#foundation/components/common/range-calendar/prev.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Prev, {
    props,
    slots,
    global: {
      stubs: { RangeCalendarPrev: createScopedStub("RangeCalendarPrev", { disabled: true }) },
    },
  });

describe("common/range-calendar/Prev", () => {
  it("renders with f-range-calendar-prev class", () => {
    expect(factory().classes()).toContain("f-range-calendar-prev");
  });

  it("re-emits click from the primitive", async () => {
    const wrapper = factory();
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("forwards the disabled payload into the slot", () => {
    const wrapper = factory({}, {
      default: "<template #default=\"p\"><b>{{ p.disabled }}</b></template>",
    });
    expect(wrapper.find("b").text()).toBe("true");
  });

  it("renders the aria channel for the button role", () => {
    expect(factory({ aria: { label: "Previous month" } }).attributes("aria-label")).toBe("Previous month");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>&lt;</b>" }).find("b").exists()).toBe(true);
  });
});
