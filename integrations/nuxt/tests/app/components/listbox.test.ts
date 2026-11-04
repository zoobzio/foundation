// The listbox wrapper: its items' text resolved.
import type { Option } from "@zoobzio/vue/types/common";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Listbox from "../../../app/components/listbox";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("listbox wrapper", () => {
  it("reads its items from the contract", () => {
    const items: Option[] = [{ value: "a", label: "table.empty" }];
    const wrapper = mount(Listbox<Option>, {
      props: { items },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.text()).toContain("No data");
    expect(wrapper.text()).not.toContain("table.empty");
  });
});
