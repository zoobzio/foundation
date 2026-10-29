// The checkbox wrapper: `check` as the indicator.
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

  it("lets a consumer's icon slot win", () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true },
      slots: { icon: "<i>x</i>" },
    });
    expect(wrapper.find("svg").exists()).toBe(false);
    expect(wrapper.get("i").text()).toBe("x");
  });
});
