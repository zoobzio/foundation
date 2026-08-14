// Smoke tests for the harness itself: alias resolution, the #imports shim's
// useState contract, and VTU stub matching against import binding names.
// Component behavior belongs in per-component suites, not here.
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { useState } from "#imports";
import Select from "../app/components/core/select.vue";
import { commonStubs } from "#test/stubs/common";
import { fakeOptions } from "#test/data/options";

describe("imports shim", () => {
  it("useState shares one ref per key", () => {
    const a = useState("harness-key", () => 1);
    const b = useState("harness-key", () => 2);
    expect(b).toBe(a);
    expect(b.value).toBe(1);
  });

  it("useState registry is cleared between tests", () => {
    // Same key as above — setup.ts's beforeEach must have reset it.
    const state = useState("harness-key", () => 2);
    expect(state.value).toBe(2);
  });
});

describe("component mounting", () => {
  it("mounts a core component raw — reka renders real DOM in happy-dom", () => {
    const wrapper = mount(Select, { props: { options: fakeOptions } });
    const trigger = wrapper.get("button.f-select-trigger");
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.text()).toContain("Select an option");
  });

  it("stubs match import binding names", () => {
    const wrapper = mount(Select, {
      props: { options: fakeOptions },
      global: { stubs: { Icon: commonStubs.Icon, Span: commonStubs.Span } },
    });
    expect(wrapper.find("i").exists()).toBe(true);
    expect(wrapper.find("svg").exists()).toBe(false);
  });
});
