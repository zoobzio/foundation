import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "#foundation/components/common/Table.vue";

const factory = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(Table, { props, slots });

describe("Table", () => {
  it("renders a div element with f-table-wrapper class", () => {
    const wrapper = factory();
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-table-wrapper");
  });

  it("renders a nested table element with f-table class", () => {
    const wrapper = factory();
    const table = wrapper.find("table");
    expect(table.exists()).toBe(true);
    expect(table.classes()).toContain("f-table");
  });

  it("binds aria-label from label prop onto the table element", () => {
    const wrapper = factory({ label: "My Table" });
    expect(wrapper.find("table").attributes("aria-label")).toBe("My Table");
    // the presentational wrapper must not carry the name
    expect(wrapper.attributes("aria-label")).toBeUndefined();
  });

  it("renders slot content inside the table", () => {
    const wrapper = factory({}, { default: "<tr><td>Cell</td></tr>" });
    expect(wrapper.find("table").text()).toBe("Cell");
  });
});
