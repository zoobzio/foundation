// Gold standard: core components. Mount depth follows the behavior under
// test: presentation axes read the trigger's real DOM; open/selection paths
// drive reka through real interactions (content teleports to document.body);
// pt and slot axes each earn one targeted mount. Nothing is stubbed — the
// wrappers underneath have their own suites for their own logic.
import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Select from "../../../../app/components/core/select.vue";
import { fakeOptions } from "#test/data/options";
import type { SelectProps } from "../../../../app/types/core/select";
import type { Option } from "../../../../app/types/core/common";

const mounted: { unmount: () => void }[] = [];

const mountSelect = (
  props: Partial<SelectProps<Option>> = {},
  slots: Record<string, string | ((scope: never) => unknown)> = {},
) => {
  const wrapper = mount(Select, {
    props: { options: fakeOptions, ...props },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const openSelect = async (wrapper: ReturnType<typeof mountSelect>) => {
  await wrapper.get("button.f-select-trigger").trigger("pointerdown", {
    button: 0,
    ctrlKey: false,
  });
};

describe("select", () => {
  it("renders a closed combobox with the placeholder", () => {
    const wrapper = mountSelect({ placeholder: "Pick one" });
    const trigger = wrapper.get("button.f-select-trigger");
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("data-state")).toBe("closed");
    expect(trigger.text()).toContain("Pick one");
    expect(trigger.find("use").attributes("href")).toBe(
      "/icons.svg#chevron-down",
    );
  });

  it("displays the controlled model's label instead of the placeholder", () => {
    const apple = fakeOptions.at(0);
    if (!apple) throw new Error("fakeOptions is empty");
    const wrapper = mountSelect({ modelValue: apple });
    expect(wrapper.get("button.f-select-trigger").text()).toContain("Apple");
  });

  it("opens on trigger interaction: emits, flips the icon, mounts options", async () => {
    const wrapper = mountSelect();
    await openSelect(wrapper);
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(
      wrapper.get("button.f-select-trigger").attributes("data-state"),
    ).toBe("open");
    expect(wrapper.get("use").attributes("href")).toBe("/icons.svg#chevron-up");
    // Content is portalled — options live under document.body, one per option.
    const items = document.querySelectorAll('[role="option"]');
    expect(items).toHaveLength(fakeOptions.length);
  });

  it("selecting an option emits the full Option and closes", async () => {
    const wrapper = mountSelect();
    await openSelect(wrapper);
    const banana = document.querySelectorAll('[role="option"]').item(1);
    if (!banana) throw new Error("no rendered option to select");
    banana.dispatchEvent(new Event("pointerup", { bubbles: true }));
    // Reka defers selection behind its own nextTick — flush the full chain.
    await flushPromises();
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toEqual([[fakeOptions.at(1)]]);
    expect(wrapper.emitted("update:open")).toEqual([[true], [false]]);
  });

  it("pt overrides reach their part", () => {
    const wrapper = mountSelect({
      pt: { triggerIcon: { alias: "settings" } },
    });
    expect(wrapper.get("use").attributes("href")).toBe("/icons.svg#settings");
  });

  it("serves ctx to slot overrides", () => {
    const wrapper = mountSelect(
      { placeholder: "Pick one" },
      {
        trigger: `<template #trigger="ctx">
          <output>{{ ctx.display }}:{{ ctx.options.length }}</output>
        </template>`,
      },
    );
    expect(wrapper.get("output").text()).toBe(`Pick one:${fakeOptions.length}`);
    expect(wrapper.find("button.f-select-trigger").exists()).toBe(false);
  });
});
