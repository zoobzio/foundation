import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Hr from "../../../../../../layers/ore/app/components/Hr.vue";

describe("Hr", () => {
  it("renders an hr element with f-hr class", () => {
    const wrapper = mount(Hr);
    expect(wrapper.element.tagName).toBe("HR");
    expect(wrapper.classes()).toContain("f-hr");
  });

  it("binds modifier data attributes", () => {
    const wrapper = mount(Hr, {
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
