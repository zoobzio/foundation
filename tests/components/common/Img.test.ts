import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Img from "#foundation/components/common/img.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Img, { props: { src: "test.png", ...props } });

describe("Img", () => {
  it("renders img with f-img class", () => {
    const wrapper = factory({ src: "/photo.jpg" });
    expect(wrapper.element.tagName).toBe("IMG");
    expect(wrapper.classes()).toContain("f-img");
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
