import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Img from "#foundation/components/common/Img.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Img, { props: { src: "test.png", ...props } });

describe("Img", () => {
  it("renders img with f-img class", () => {
    const wrapper = factory({ src: "/photo.jpg" });
    expect(wrapper.element.tagName).toBe("IMG");
    expect(wrapper.classes()).toContain("f-img");
  });

  it("binds modifier data attributes", () => {
    const wrapper = factory({ src: "/photo.jpg", variant: "outlined", size: "sm", color: "primary", radius: "md", density: "compact", elevation: "sm" });
    expect(wrapper.attributes("data-variant")).toBe("outlined");
    expect(wrapper.attributes("data-size")).toBe("sm");
    expect(wrapper.attributes("data-color")).toBe("primary");
    expect(wrapper.attributes("data-radius")).toBe("md");
    expect(wrapper.attributes("data-density")).toBe("compact");
    expect(wrapper.attributes("data-elevation")).toBe("sm");
  });

  it("sets src attribute", () => {
    const wrapper = factory({ src: "/photo.jpg" });
    expect(wrapper.attributes("src")).toBe("/photo.jpg");
  });

  it("sets alt attribute", () => {
    const wrapper = factory({ src: "/photo.jpg", alt: "A photo" });
    expect(wrapper.attributes("alt")).toBe("A photo");
  });
});
