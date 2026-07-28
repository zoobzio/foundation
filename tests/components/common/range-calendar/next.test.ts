import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createScopedStub } from "#test/stubs";
import Next from "#foundation/components/common/range-calendar/next.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Next, {
    props,
    slots,
    global: {
      stubs: { RangeCalendarNext: createScopedStub("RangeCalendarNext", { disabled: false }) },
    },
  });

describe("common/range-calendar/Next", () => {
  it("renders with f-range-calendar-next class", () => {
    expect(factory().classes()).toContain("f-range-calendar-next");
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
    expect(wrapper.find("b").text()).toBe("false");
  });

  it("renders the aria channel for the button role", () => {
    expect(factory({ aria: { label: "Next month" } }).attributes("aria-label")).toBe("Next month");
  });

  it("renders default slot content", () => {
    expect(factory({}, { default: "<b>&gt;</b>" }).find("b").exists()).toBe(true);
  });
});
