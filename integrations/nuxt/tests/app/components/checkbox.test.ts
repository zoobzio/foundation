// The checkbox wrapper: `check` as the indicator, `indeterminate` while
// the checkbox is neither on nor off.
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Checkbox from "../../../app/components/checkbox";

describe("checkbox wrapper", () => {
  it("draws the check icon as the indicator", () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true } });
    expect(
      wrapper.get(".f-checkbox-root svg[data-icon]").attributes("data-icon"),
    ).toBe("check");
  });

  it("draws the indeterminate icon while it is neither on nor off", async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: "indeterminate" },
    });
    const drawn = () =>
      wrapper.get(".f-checkbox-root svg[data-icon]").attributes("data-icon");
    expect(drawn()).toBe("indeterminate");
    expect(wrapper.get(".f-checkbox-root").attributes("data-state")).toBe(
      "indeterminate",
    );
    await wrapper.setProps({ modelValue: true });
    expect(drawn()).toBe("check");
  });

  it("lets a consumer's icon slot win", () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true },
      slots: { icon: "<i>x</i>" },
    });
    expect(wrapper.find("svg").exists()).toBe(false);
    expect(wrapper.get("i").text()).toBe("x");
  });
});
