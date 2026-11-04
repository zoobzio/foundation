// The select wrapper: `expand` after the display.
import type { Option } from "@zoobzio/vue/types/common";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Select from "../../../app/components/select";

const options: Option[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("select wrapper", () => {
  it("draws expand after the display", () => {
    const wrapper = mount(Select<Option>, {
      props: { options, placeholder: "Pick" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const trigger = wrapper.get("button.f-select-trigger");
    expect(trigger.text()).toBe("Pick");
    expect(trigger.element.lastElementChild?.getAttribute("data-icon")).toBe(
      "expand",
    );
  });

  it("lets a consumer's triggerAppend win", () => {
    const wrapper = mount(Select<Option>, {
      props: { options },
      slots: { triggerAppend: "<i>v</i>" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.find("svg").exists()).toBe(false);
    expect(wrapper.get("button.f-select-trigger i").text()).toBe("v");
  });

  it("reads its placeholder and its options from the contract", () => {
    const keyed: Option[] = [{ value: "a", label: "table.empty" }];
    const bare = mount(Select<Option>, {
      props: { options: keyed },
      attachTo: document.body,
    });
    mounted.push(bare);
    expect(bare.get("button.f-select-trigger").text()).toBe("Select an option");
    const chosen = mount(Select<Option>, {
      props: { options: keyed, modelValue: keyed[0] },
      attachTo: document.body,
    });
    mounted.push(chosen);
    expect(chosen.get("button.f-select-trigger").text()).toBe("No data");
  });
});
