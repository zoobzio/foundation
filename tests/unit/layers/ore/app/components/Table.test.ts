import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "../../../../../../layers/ore/app/components/Table.vue";

describe("Table", () => {
  it("renders a div element with f-table-wrapper class", () => {
    const wrapper = mount(Table);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("f-table-wrapper");
  });

  it("renders a nested table element with f-table class", () => {
    const wrapper = mount(Table);
    const table = wrapper.find("table");
    expect(table.exists()).toBe(true);
    expect(table.classes()).toContain("f-table");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Table, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("binds aria-label from label prop", () => {
    const wrapper = mount(Table, { props: { label: "My Table" } });
    expect(wrapper.attributes("aria-label")).toBe("My Table");
  });

  it("renders slot content inside the table", () => {
    const wrapper = mount(Table, {
      slots: { default: "<tr><td>Cell</td></tr>" },
    });
    expect(wrapper.find("table").text()).toBe("Cell");
  });
});
