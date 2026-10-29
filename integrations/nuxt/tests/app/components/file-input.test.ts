// The file input wrapper: `remove` before each file's remove label.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FileInput from "../../../app/components/file-input";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("file input wrapper", () => {
  it("draws remove before each file's remove label", () => {
    const wrapper = mount(FileInput, {
      props: { modelValue: [new File(["x"], "x.txt")] },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const remove = wrapper.get(".f-file-input-item-remove");
    expect(remove.get("svg[data-icon]").attributes("data-icon")).toBe("remove");
    expect(remove.text()).toBe("Remove");
  });
});
