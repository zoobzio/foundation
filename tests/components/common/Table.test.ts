import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "#foundation/components/common/table.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Table, { props, slots });

describe("Table", () => {
  it("renders a table element with f-table class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("TABLE");
    expect(wrapper.classes()).toContain("f-table");
  });

  it("binds aria-label from the aria channel", () => {
    const wrapper = factory({ aria: { label: "My Table" } });
    expect(wrapper.attributes("aria-label")).toBe("My Table");
  });

  it("renders slot content inside the table", () => {
    const wrapper = factory({}, { default: "<tr><td>Cell</td></tr>" });
    expect(wrapper.find("table").text()).toBe("Cell");
  });
});
