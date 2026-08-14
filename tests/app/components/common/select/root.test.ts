// Gold standard: reka wrappers. The wrapper's own logic is model wiring and
// prop forwarding into the reka primitive — observable only through reka's
// rendered state, so the harness slots a real reka trigger under the root and
// reads its data-state/attrs. Full selection round-trips belong to the core
// components that compose these parts (tests/components/core/select.test.ts).
import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import { SelectTrigger } from "reka-ui";
import SelectRoot from "../../../../../app/components/common/select/root.vue";
import type { SelectRootProps } from "../../../../../app/types/common/select/root";

const mountRoot = (props: SelectRootProps = {}) =>
  mount(SelectRoot, {
    props,
    slots: { default: () => h(SelectTrigger, () => "trigger") },
  });

describe("select root", () => {
  it("provides reka context to slotted primitives", () => {
    const trigger = mountRoot().get("button");
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("data-state")).toBe("closed");
  });

  it("uncontrolled open: trigger interaction flips state and re-emits", async () => {
    const wrapper = mountRoot();
    const trigger = wrapper.get("button");
    await trigger.trigger("pointerdown", { button: 0, ctrlKey: false });
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(trigger.attributes("data-state")).toBe("open");
  });

  it("controlled open: renders the prop's state", () => {
    const trigger = mountRoot({ open: true }).get("button");
    expect(trigger.attributes("data-state")).toBe("open");
    expect(trigger.attributes("aria-expanded")).toBe("true");
  });

  it("model presence clears reka's placeholder state", () => {
    expect(
      mountRoot().get("button").attributes("data-placeholder"),
    ).toBeDefined();
    expect(
      mountRoot({ modelValue: "apple" }).get("button").attributes("data-placeholder"),
    ).toBeUndefined();
  });

  it("forwards rest props into the reka root", () => {
    const trigger = mountRoot({ disabled: true }).get("button");
    expect(trigger.attributes("data-disabled")).toBeDefined();
    expect(trigger.attributes("disabled")).toBeDefined();
  });
});
