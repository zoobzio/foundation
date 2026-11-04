// The fab wrapper: its label resolved.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Fab from "../../../app/components/fab";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("fab wrapper", () => {
  it("reads its label from the contract", () => {
    const wrapper = mount(Fab, {
      props: { label: "table.refresh" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.get("button").attributes("aria-label")).toBe("Refresh");
  });
});
