import type { FormFieldProps } from "../../src/types/components/form-field";
import type { FakePayload } from "#test/data/form";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import FormField from "../../src/components/form-field.vue";
import { makeForm } from "#test/mount/form";
import { fakeField } from "#test/data/form";

const mounted: { unmount: () => void }[] = [];

const mountField = (
  props: FormFieldProps<FakePayload>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(FormField<FakePayload>, {
    props,
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

describe("form-field", () => {
  it("renders a text input seeded from the payload, spanning its colspan", () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("name") });
    const input = wrapper.get<HTMLInputElement>("input.f-data-form-input");
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("placeholder")).toBe("Your name");
    expect(input.element.value).toBe("Alice");
    expect(wrapper.attributes("style")).toContain("grid-column: span 6");
  });

  it("renders a number input with its bounds and parses writes", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("age") });
    const input = wrapper.get<HTMLInputElement>("input.f-data-form-input");
    expect(input.attributes("type")).toBe("number");
    expect(input.attributes("min")).toBe("0");
    expect(input.attributes("max")).toBe("120");
    await input.setValue("42");
    expect(service.payload.age).toBe(42);
    await input.setValue("");
    expect(service.payload.age).toBeUndefined();
  });

  it("renders a textarea and writes through it", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("bio") });
    const area = wrapper.get("textarea.f-data-form-textarea");
    expect(area.attributes("rows")).toBe("3");
    await area.setValue("Hello");
    expect(service.payload.bio).toBe("Hello");
  });

  it("renders a select on the current option and writes a pick", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("role") });
    const trigger = wrapper.get("button.f-select-trigger");
    expect(trigger.text()).toContain("Admin");
    await trigger.trigger("pointerdown", { button: 0, ctrlKey: false });
    await flushPromises();
    const member = Array.from(
      document.querySelectorAll<HTMLElement>('[role="option"]'),
    ).find((el) => el.textContent?.includes("Member"));
    if (!member) throw new Error("no rendered Member option");
    member.dispatchEvent(new Event("pointerup", { bubbles: true }));
    await flushPromises();
    expect(service.payload.role).toBe("member");
    expect(service.touched.has("role")).toBe(true);
  });

  it("renders a checkbox and toggles the boolean", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("active") });
    const box = wrapper.get('[role="checkbox"]');
    expect(box.attributes("aria-checked")).toBe("false");
    await box.trigger("click");
    await flushPromises();
    expect(service.payload.active).toBe(true);
    expect(box.attributes("aria-checked")).toBe("true");
  });

  it("renders a radio group and writes a pick", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("plan") });
    const radios = wrapper.findAll('[role="radio"]');
    expect(radios.map((radio) => radio.attributes("aria-checked"))).toEqual([
      "true",
      "false",
    ]);
    await radios[1]!.trigger("click");
    await flushPromises();
    expect(service.payload.plan).toBe("pro");
  });

  it("renders the multi-select, date picker, and tags input by type", () => {
    const { service } = makeForm();
    const teams = mountField({ service, field: fakeField("teams") });
    expect(teams.get("button.f-select-trigger").text()).toContain("Core");
    const starts = mountField({ service, field: fakeField("starts") });
    expect(starts.get(".f-date-picker-field").text()).toContain("2025");
    const tags = mountField({ service, field: fakeField("tags") });
    expect(
      tags.findAll(".f-tags-input-item-text").map((tag) => tag.text()),
    ).toEqual(["one"]);
  });

  it("shows the error only once the field is touched", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("name") });
    service.set("name", "");
    service.check("name");
    await flushPromises();
    expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    service.touch("name");
    await flushPromises();
    expect(wrapper.get(".f-data-form-field-error").text()).toBe(
      "Name is required",
    );
  });

  it("serves ctx to slot overrides", () => {
    const { service } = makeForm();
    const wrapper = mountField(
      { service, field: fakeField("name") },
      {
        input: `<template #input="{ control, field, value }">
          <output>{{ control }}:{{ field.key }}:{{ value }}</output>
        </template>`,
      },
    );
    expect(wrapper.get("output").text()).toBe("input:name:Alice");
    expect(wrapper.find("input.f-data-form-input").exists()).toBe(false);
  });

  it("pt overrides reach the active control", () => {
    const { service } = makeForm();
    const wrapper = mountField({
      service,
      field: fakeField("bio"),
      pt: { textarea: { rows: 8 } },
    });
    expect(wrapper.get("textarea").attributes("rows")).toBe("8");
  });
});
