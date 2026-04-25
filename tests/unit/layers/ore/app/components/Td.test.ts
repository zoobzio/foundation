import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Td from "../../../../../../layers/ore/app/components/Td.vue";

describe("Td", () => {
  it("renders a td element with f-td class", () => {
    const wrapper = mount(Td);
    expect(wrapper.element.tagName).toBe("TD");
    expect(wrapper.classes()).toContain("f-td");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Td, {
      props: { variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" },
    });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });
});
