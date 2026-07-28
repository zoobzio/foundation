import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { rekaStubs } from "#test/stubs";
import Input from "#foundation/components/common/tags-input/input.vue";

const factory = (props: Record<string, unknown> = {}) =>
  mount(Input, { props, global: { stubs: rekaStubs("TagsInputInput") } });

describe("common/tags-input/Input", () => {
  it("renders with f-tags-input-input class", () => {
    expect(factory().classes()).toContain("f-tags-input-input");
  });

  it("forwards reka props through the rest spread", () => {
    const wrapper = factory({ placeholder: "Add tags...", maxLength: 10 });
    expect(wrapper.attributes("placeholder")).toBe("Add tags...");
    expect(wrapper.attributes("maxlength")).toBe("10");
  });

  it("renders the tokens channel as inline style", () => {
    const wrapper = factory({ tokens: { "primary-500": "primary-600" } });
    expect(wrapper.attributes("style")).toContain(
      "--primary-500: var(--primary-600)",
    );
  });

  it("renders the aria channel for the textbox role", () => {
    expect(factory({ aria: { label: "Add tag" } }).attributes("aria-label")).toBe("Add tag");
  });
});
