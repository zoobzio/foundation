// The rich text wrapper: an icon toolbar, as the editor.
import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RichText from "../../../app/components/rich-text";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("rich text wrapper", () => {
  it("draws each tool as its icon, named by its label", () => {
    const wrapper = mount(RichText, {
      props: { modelValue: "<p>Hello</p>" },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const italic = wrapper.get('button[data-tool="italic"]');
    expect(italic.get("svg[data-icon]").attributes("data-icon")).toBe("italic");
    expect(italic.text()).toBe("");
    expect(italic.attributes("aria-label")).toBe("Italic");
    expect(
      wrapper
        .get('button[data-tool="codeBlock"] svg[data-icon]')
        .attributes("data-icon"),
    ).toBe("code-block");
  });

  it("disabled turns every tool off, roving focus included", () => {
    const wrapper = mount(RichText, {
      props: { modelValue: "<p>Hello</p>", disabled: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const tools = wrapper.findAll("button[data-tool]");
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.every((b) => b.attributes("disabled") !== undefined)).toBe(
      true,
    );
    expect(
      tools.every((b) => b.attributes("data-disabled") !== undefined),
    ).toBe(true);
  });
});
