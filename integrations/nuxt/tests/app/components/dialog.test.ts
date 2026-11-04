// The dialog wrapper: its title and description resolved.
import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Dialog from "../../../app/components/dialog";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("dialog wrapper", () => {
  it("reads its title and description from the contract", async () => {
    const wrapper = mount(Dialog, {
      props: { open: true, title: "table.empty", description: "error.unknown" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    expect(document.body.textContent).toContain("No data");
    expect(document.body.textContent).toContain("Something went wrong.");
  });
});
