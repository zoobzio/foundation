// The rich text wrapper: each tool's icon before its label, as the editor.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RichText from "../../../app/components/rich-text";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("rich text wrapper", () => {
  it("draws each tool's icon before its label", () => {
    const wrapper = mount(RichText, {
      props: { modelValue: "<p>Hello</p>" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper
        .get('button[data-tool="italic"] svg[data-icon]')
        .attributes("data-icon"),
    ).toBe("italic");
    expect(
      wrapper
        .get('button[data-tool="codeBlock"] svg[data-icon]')
        .attributes("data-icon"),
    ).toBe("code-block");
  });
});
