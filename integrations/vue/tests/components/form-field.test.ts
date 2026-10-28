import type { FormFieldProps } from "../../src/types/components/form-field";
import type { FakePayload } from "#test/data/form";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { toRaw } from "vue";
import FormField from "../../src/components/form-field.vue";
import { makeForm } from "#test/mount/form";
import { fakeField, fakeFile } from "#test/data/form";

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

  it("renders tel and url inputs by type", () => {
    const { service } = makeForm();
    const phone = mountField({ service, field: fakeField("phone") });
    const tel = phone.get<HTMLInputElement>("input.f-data-form-input");
    expect(tel.attributes("type")).toBe("tel");
    expect(tel.element.value).toBe("+1 555 0100");
    const site = mountField({ service, field: fakeField("site") });
    expect(site.get("input.f-data-form-input").attributes("type")).toBe("url");
  });

  it("renders native date and time inputs and writes strings", async () => {
    const { service } = makeForm();
    const alarm = mountField({ service, field: fakeField("alarm") });
    const time = alarm.get<HTMLInputElement>("input.f-data-form-input");
    expect(time.attributes("type")).toBe("time");
    expect(time.attributes("min")).toBe("06:00");
    expect(time.attributes("step")).toBe("900");
    expect(time.element.value).toBe("07:30");
    await time.setValue("08:15");
    expect(service.payload.alarm).toBe("08:15");
    const meeting = mountField({ service, field: fakeField("meeting") });
    expect(meeting.get("input.f-data-form-input").attributes("type")).toBe(
      "datetime-local",
    );
    const birthday = mountField({ service, field: fakeField("birthday") });
    const date = birthday.get<HTMLInputElement>("input.f-data-form-input");
    expect(date.attributes("type")).toBe("date");
    expect(date.attributes("max")).toBe("2025-12-31");
    await date.setValue("2000-01-01");
    expect(service.payload.birthday).toBe("2000-01-01");
  });

  it("renders a text input's max length", () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("name") });
    expect(wrapper.get("input").attributes("maxlength")).toBe("40");
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

  it("renders a file input seeded from the payload and writes a pick", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("avatar") });
    const input = wrapper.get<HTMLInputElement>("input.f-file-input-input");
    expect(input.attributes("type")).toBe("file");
    expect(input.attributes("accept")).toBe("image/*");
    expect(input.attributes("multiple")).toBeUndefined();
    expect(wrapper.get(".f-file-input-item-name").text()).toBe("avatar.png");
    const next = fakeFile("next.png");
    Object.defineProperty(input.element, "files", { value: [next] });
    await input.trigger("change");
    // happy-dom's File lacks the `[object File]` tag browsers give it, so
    // the reactive container proxies it here and nowhere else.
    expect(toRaw(service.payload.avatar)).toBe(next);
    expect(wrapper.get(".f-file-input-item-name").text()).toBe("next.png");
    await wrapper.get(".f-file-input-item-remove").trigger("click");
    expect(service.payload.avatar).toBeUndefined();
    expect(wrapper.find(".f-file-input-item").exists()).toBe(false);
  });

  it("renders a multiple file input", () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("attachments") });
    const input = wrapper.get("input.f-file-input-input");
    expect(input.attributes("multiple")).toBeDefined();
    expect(wrapper.findAll(".f-file-input-item")).toHaveLength(0);
  });

  it("renders a rich text editor over the payload HTML and writes edits", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("body") });
    const host = wrapper.get(".f-data-editor-content");
    expect(host.html()).toContain("<p>Hello</p>");
    const tools = wrapper
      .findAll(".f-data-editor-tool")
      .map((b) => b.attributes("data-tool"));
    expect(tools).toContain("heading-2");
    expect(tools).not.toContain("heading-1");
    expect(tools).not.toContain("bulletList");
    await host.trigger("pointerdown");
    expect(host.attributes("contenteditable")).toBe("true");
    service.set("body", "");
    await flushPromises();
    expect(host.text()).toBe("");
    await host.trigger("blur");
    expect(service.touched.has("body")).toBe(true);
    expect(wrapper.get(".f-data-form-field-error").text()).toBe(
      "Body is required",
    );
    expect(host.attributes("aria-invalid")).toBe("true");
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

  it("labels the control and describes it with the hint", () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("name") });
    const label = wrapper.get("label.f-data-form-field-label");
    expect(label.attributes("id")).toBe("test-form-name-label");
    expect(label.attributes("for")).toBe("test-form-name");
    const hint = wrapper.get(".f-data-form-field-hint");
    expect(hint.text()).toBe("Shown on your profile");
    expect(hint.attributes("id")).toBe("test-form-name-hint");
    const input = wrapper.get("input.f-data-form-input");
    expect(input.attributes("id")).toBe("test-form-name");
    expect(input.attributes("aria-describedby")).toBe("test-form-name-hint");
  });

  it("adds the error to the description while it shows", async () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("name") });
    service.set("name", "");
    service.touch("name");
    service.check("name");
    await flushPromises();
    const error = wrapper.get(".f-data-form-field-error");
    expect(error.attributes("id")).toBe("test-form-name-error");
    expect(wrapper.get("input").attributes("aria-describedby")).toBe(
      "test-form-name-hint test-form-name-error",
    );
    service.set("name", "Bob");
    service.check("name");
    await flushPromises();
    expect(wrapper.get("input").attributes("aria-describedby")).toBe(
      "test-form-name-hint",
    );
  });

  it("renders no hint and no description without one", () => {
    const { service } = makeForm();
    const wrapper = mountField({ service, field: fakeField("age") });
    expect(wrapper.find(".f-data-form-field-hint").exists()).toBe(false);
    const input = wrapper.get("input.f-data-form-input");
    expect(input.attributes("id")).toBe("test-form-age");
    expect(input.attributes("aria-describedby")).toBeUndefined();
  });

  it("wires every control to its label and hint", () => {
    const { service } = makeForm();
    const role = mountField({ service, field: fakeField("role") });
    const trigger = role.get("button.f-select-trigger");
    expect(trigger.attributes("id")).toBe("test-form-role");
    expect(trigger.attributes("aria-describedby")).toBe("test-form-role-hint");
    const active = mountField({ service, field: fakeField("active") });
    const box = active.get('[role="checkbox"]');
    expect(box.attributes("id")).toBe("test-form-active");
    expect(box.attributes("aria-describedby")).toBe("test-form-active-hint");
    const plan = mountField({ service, field: fakeField("plan") });
    const group = plan.get('[role="radiogroup"]');
    expect(group.attributes("id")).toBe("test-form-plan");
    expect(group.attributes("aria-labelledby")).toBe("test-form-plan-label");
    expect(group.attributes("aria-describedby")).toBe("test-form-plan-hint");
    const starts = mountField({ service, field: fakeField("starts") });
    const field = starts.get(".f-date-picker-field");
    expect(field.attributes("aria-labelledby")).toBe("test-form-starts-label");
    expect(field.attributes("aria-describedby")).toBe("test-form-starts-hint");
    expect(starts.find("#test-form-starts").exists()).toBe(true);
    const tags = mountField({ service, field: fakeField("tags") });
    const tagsInput = tags.get("input.f-tags-input-input");
    expect(tagsInput.attributes("id")).toBe("test-form-tags");
    expect(tagsInput.attributes("aria-describedby")).toBe(
      "test-form-tags-hint",
    );
    const avatar = mountField({ service, field: fakeField("avatar") });
    const file = avatar.get("input.f-file-input-input");
    expect(file.attributes("id")).toBe("test-form-avatar");
    expect(file.attributes("aria-describedby")).toBe("test-form-avatar-hint");
    const body = mountField({ service, field: fakeField("body") });
    const host = body.get(".f-data-editor-content");
    expect(host.attributes("id")).toBe("test-form-body");
    expect(host.attributes("aria-labelledby")).toBe("test-form-body-label");
    expect(host.attributes("aria-describedby")).toBe("test-form-body-hint");
  });

  it("serves ctx to the hint slot", () => {
    const { service } = makeForm();
    const wrapper = mountField(
      { service, field: fakeField("name") },
      {
        hint: `<template #hint="{ ids, field }">
          <output :id="ids.hint">{{ field.hint }}!</output>
        </template>`,
      },
    );
    const out = wrapper.get("output");
    expect(out.text()).toBe("Shown on your profile!");
    expect(out.attributes("id")).toBe("test-form-name-hint");
    expect(wrapper.find(".f-data-form-field-hint").exists()).toBe(false);
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
