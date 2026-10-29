// The tags input wrapper: `remove` before each tag's delete label.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TagsInput from "../../../app/components/tags-input";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("tags input wrapper", () => {
  it("draws remove before each tag's delete label", () => {
    const wrapper = mount(TagsInput, {
      props: { modelValue: ["one", "two"] },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const deletes = wrapper.findAll(".f-tags-input-item-delete");
    expect(deletes).toHaveLength(2);
    expect(
      deletes.map((d) => d.get("svg[data-icon]").attributes("data-icon")),
    ).toEqual(["remove", "remove"]);
  });
});
