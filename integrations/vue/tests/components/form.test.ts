import type { FormProps } from "../../src/types/components/form";
import type { FakePayload } from "#test/data/form";

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Form from "../../src/components/form.vue";
import { makeForm } from "#test/mount/form";
import { fakeFields, fakeRecord } from "#test/data/form";

const mounted: { unmount: () => void }[] = [];

const mountForm = (
  props: FormProps<FakePayload>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Form<FakePayload>, {
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

describe("form", () => {
  it("renders the title and one field per config entry", () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    expect(wrapper.get(".f-data-form-title").text()).toBe("Profile");
    const labels = wrapper
      .findAll(".f-data-form-field-label")
      .map((label) => label.text());
    expect(labels).toEqual(fakeFields.map((field) => field.label));
  });

  it("seeds the controls from the payload", () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    const inputs = wrapper.findAll<HTMLInputElement>("input.f-data-form-input");
    expect(inputs.map((input) => input.element.value)).toEqual([
      "Alice",
      "30",
      "+1 555 0100",
      "https://example.com",
      "07:30",
      "2025-03-04T09:00",
      "1990-05-20",
    ]);
  });

  it("writes typed input to the payload through the service", async () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    await wrapper.get("input.f-data-form-input").setValue("Bob");
    expect(service.payload.name).toBe("Bob");
  });

  it("surfaces a field error once the field is touched", async () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    const name = wrapper.get("input.f-data-form-input");
    await name.setValue("");
    expect(wrapper.find(".f-data-form-field-error").exists()).toBe(false);
    await name.trigger("blur");
    expect(wrapper.get(".f-data-form-field-error").text()).toBe(
      "Name is required",
    );
    expect(name.attributes("aria-invalid")).toBe("true");
  });

  it("rejects an invalid submit and emits rejected", async () => {
    const submit = vi.fn(async () => {});
    const { service } = makeForm({}, { submit });
    const wrapper = mountForm({ service });
    service.set("name", "");
    await wrapper.get(".f-data-form-submit").trigger("click");
    await flushPromises();
    expect(submit).not.toHaveBeenCalled();
    expect(wrapper.emitted("rejected")?.at(0)).toEqual([
      {
        id: "test-form",
        data: service.payload,
        errors: { name: "Name is required" },
      },
    ]);
    expect(wrapper.get(".f-data-form-field-error").text()).toBe(
      "Name is required",
    );
  });

  it("runs the submit action on a valid payload and emits submitted", async () => {
    const submit = vi.fn(async () => {});
    const { service } = makeForm({}, { submit });
    const wrapper = mountForm({ service });
    await wrapper.get(".f-data-form-submit").trigger("click");
    await flushPromises();
    expect(submit).toHaveBeenCalledWith(service);
    expect(service.submitted).toBe(true);
    expect(wrapper.emitted("submitted")?.at(0)).toEqual([
      { id: "test-form", data: service.payload },
    ]);
  });

  it("disables the submit button while the action is pending", async () => {
    let settle = () => {};
    const submit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const { service } = makeForm({}, { submit });
    const wrapper = mountForm({ service });
    const button = wrapper.get(".f-data-form-submit");
    expect(button.text()).toBe("Submit");
    await button.trigger("click");
    await flushPromises();
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toBe("Submitting...");
    settle();
    await flushPromises();
    expect(button.attributes("disabled")).toBeUndefined();
    expect(button.text()).toBe("Submit");
  });

  it("resets to the defaults and emits reset", async () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    service.set("name", "Bob");
    await wrapper.get(".f-data-form-reset").trigger("click");
    expect(service.payload.name).toBe("Alice");
    expect(wrapper.emitted("reset")?.at(0)).toEqual([
      { id: "test-form", data: service.payload },
    ]);
    expect(
      wrapper.get<HTMLInputElement>("input.f-data-form-input").element.value,
    ).toBe("Alice");
  });

  it("relays the init and restore events as emits", async () => {
    const { service } = makeForm();
    const wrapper = mountForm({ service });
    await service.initialize();
    expect(wrapper.emitted("initialized")?.at(0)).toEqual([
      { id: "test-form", data: service.payload },
    ]);
    service.restore(fakeRecord);
    await flushPromises();
    expect(wrapper.emitted("restored")?.at(0)).toEqual([
      { id: "test-form", data: fakeRecord },
    ]);
    expect(
      wrapper.get<HTMLInputElement>("input.f-data-form-input").element.value,
    ).toBe("Carol");
  });

  it("relays a failed submit as an emit", async () => {
    const cause = new Error("boom");
    const submit = vi.fn(async () => {
      throw cause;
    });
    const { service } = makeForm({}, { submit });
    const wrapper = mountForm({ service });
    await expect(service.submit()).rejects.toBe(cause);
    expect(wrapper.emitted("failed")?.at(0)).toEqual([
      { id: "test-form", stage: "submit", cause },
    ]);
  });

  it("relays a field slot to every field", () => {
    const { service } = makeForm();
    const wrapper = mountForm(
      { service },
      {
        label: `<template #label="{ field }"><b>{{ field.label }}!</b></template>`,
      },
    );
    expect(
      wrapper.findAll(".f-data-form-field b").map((b) => b.text()),
    ).toEqual(fakeFields.map((field) => `${field.label}!`));
    expect(wrapper.find(".f-data-form-field-label").exists()).toBe(false);
  });

  it("relays the hint slot to the fields with a hint", () => {
    const { service } = makeForm();
    const wrapper = mountForm(
      { service },
      {
        hint: `<template #hint="{ field }"><i>{{ field.hint }}</i></template>`,
      },
    );
    expect(
      wrapper.findAll(".f-data-form-field i").map((i) => i.text()),
    ).toEqual(fakeFields.flatMap((field) => (field.hint ? [field.hint] : [])));
    expect(wrapper.find(".f-data-form-field-hint").exists()).toBe(false);
  });

  it("serves ctx to the toolbar and footer slots", () => {
    const { service } = makeForm();
    const wrapper = mountForm(
      { service },
      {
        toolbar: `<template #toolbar="{ form }"><h1>{{ form.config.title }}</h1></template>`,
        footer: `<template #footer="{ form }"><output>{{ form.valid }}</output></template>`,
      },
    );
    expect(wrapper.get("h1").text()).toBe("Profile");
    expect(wrapper.get("output").text()).toBe("true");
    expect(wrapper.find(".f-data-form-title").exists()).toBe(false);
    expect(wrapper.find(".f-data-form-submit").exists()).toBe(false);
  });

  it("pt overrides reach the form and its buttons", async () => {
    const { service } = makeForm();
    const wrapper = mountForm({
      service,
      pt: {
        form: { autocomplete: "off" },
        reset: { disabled: true },
        submit: { title: "Save" },
      },
    });
    expect(wrapper.get("form").attributes("autocomplete")).toBe("off");
    expect(
      wrapper.get(".f-data-form-reset").attributes("disabled"),
    ).toBeDefined();
    expect(wrapper.get(".f-data-form-submit").attributes("title")).toBe("Save");
  });

  it("submits on the native form submit event", async () => {
    const submit = vi.fn(async () => {});
    const { service } = makeForm({}, { submit });
    const wrapper = mountForm({ service });
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(submit).toHaveBeenCalledWith(service);
  });

  it("pt overrides reach a field by its payload key", () => {
    const { service } = makeForm();
    const wrapper = mountForm({
      service,
      pt: { fields: { name: { input: { placeholder: "Who?" } } } },
    });
    expect(
      wrapper.get("input.f-data-form-input").attributes("placeholder"),
    ).toBe("Who?");
  });
});
