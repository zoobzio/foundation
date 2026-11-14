// The image input wrapper: its labels through the prose contract, `image`
// in the placeholder, and `camera` and `remove` before the labels.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ImageInput from "../../../app/components/image-input";

const mounted: { unmount: () => void }[] = [];

const mountInput = (props: { modelValue?: string } = {}) => {
  const wrapper = mount(ImageInput, { props, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("image input wrapper", () => {
  it("labels the pick by whether there is an image", () => {
    expect(mountInput().get(".f-image-input-pick").text()).toBe("Choose");
    expect(
      mountInput({ modelValue: "/a.png" }).get(".f-image-input-pick").text(),
    ).toBe("Change");
  });

  it("draws image in the placeholder and camera before the pick label", () => {
    const wrapper = mountInput();
    expect(
      wrapper
        .get(".f-image-input-placeholder svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("image");
    expect(
      wrapper.get(".f-image-input-pick svg[data-icon]").attributes("data-icon"),
    ).toBe("camera");
  });

  it("draws remove before the remove label", () => {
    const remove = mountInput({ modelValue: "/a.png" }).get(
      ".f-image-input-remove",
    );
    expect(remove.get("svg[data-icon]").attributes("data-icon")).toBe("remove");
    expect(remove.text()).toBe("Remove");
  });
});
