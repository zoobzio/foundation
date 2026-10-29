// The command wrapper: `search` before the filter, an option's `icon`
// before its label, the layer's Checkbox behind each option's checkbox.
import type {
  CommandGroup,
  CommandOption,
} from "@zoobzio/vue/types/components/command";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Command from "../../../app/components/command";

const groups: CommandGroup<CommandOption>[] = [
  {
    key: "fruit",
    label: "Fruit",
    options: [
      { value: "apple", label: "Apple", icon: "add" },
      { value: "pear", label: "Pear" },
    ],
  },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});
const iconsOf = (root: { querySelectorAll: ParentNode["querySelectorAll"] }) =>
  Array.from(root.querySelectorAll<SVGElement>("svg[data-icon]")).map((svg) =>
    svg.getAttribute("data-icon"),
  );

describe("command wrapper", () => {
  it("draws search before the filter and an option's icon before its label", () => {
    const wrapper = mount(Command<CommandOption>, {
      props: { groups },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const filter = wrapper.get(".f-listbox-filter");
    expect(
      filter.element.previousElementSibling?.getAttribute("data-icon"),
    ).toBe("search");
    const options = wrapper.findAll('[role="option"]');
    expect(options.map((o) => iconsOf(o.element))).toEqual([["add"], []]);
  });

  it("renders each option's checkbox through the layer's Checkbox when multiple", () => {
    const wrapper = mount(Command<CommandOption>, {
      props: { groups, multiple: true, modelValue: [] },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const pear = wrapper.findAll('[role="option"]').at(1);
    expect(iconsOf(pear!.element)).toEqual(["check"]);
  });
});
