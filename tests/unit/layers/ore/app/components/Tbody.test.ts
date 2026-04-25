import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Tbody from "../../../../../../layers/ore/app/components/Tbody.vue";

describe("Tbody", () => {
  it("renders a tbody element with f-tbody class", () => {
    const wrapper = mount(Tbody);
    expect(wrapper.element.tagName).toBe("TBODY");
    expect(wrapper.classes()).toContain("f-tbody");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Tbody, {
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
