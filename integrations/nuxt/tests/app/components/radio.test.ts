// The radio wrapper: its options' text resolved.
import type { Option } from "@zoobzio/vue/types/common";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Radio from "../../../app/components/radio";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("radio wrapper", () => {
  it("reads its options from the contract", () => {
    const options: Option[] = [{ value: "a", label: "table.empty" }];
    const wrapper = mount(Radio<Option>, {
      props: { options },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.text()).toContain("No data");
    expect(wrapper.text()).not.toContain("table.empty");
  });
});
