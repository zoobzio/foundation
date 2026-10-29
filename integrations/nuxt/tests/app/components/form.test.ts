// The form wrapper: the layer's FormField behind the `field` part, so a
// field's control draws its icons.
import type { Field } from "@zoobzio/form";
import type { FakePayload } from "#test/data/form";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { z } from "zod";
import Form from "../../../app/components/form";
import { makeForm } from "#test/mount/form";

type Payload = FakePayload & { role: "admin" | "member"; active: boolean };

const fields: Field<Payload>[] = [
  { type: "text", key: "name", label: "Name" },
  { type: "number", key: "amount", label: "Amount" },
  {
    type: "select",
    key: "role",
    label: "Role",
    options: [
      { value: "admin", label: "Admin" },
      { value: "member", label: "Member" },
    ],
  },
  { type: "checkbox", key: "active", label: "Active" },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("form wrapper", () => {
  it("renders a select field through the layer's Select and a checkbox through its Checkbox", () => {
    const { service } = makeForm({
      fields: fields as Field<FakePayload>[],
      schema: z.object({
        name: z.string(),
        amount: z.number(),
        role: z.enum(["admin", "member"]),
        active: z.boolean(),
      }) as never,
    });
    const wrapper = mount(Form<FakePayload>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper
        .get("button.f-select-trigger svg[data-icon]")
        .attributes("data-icon"),
    ).toBe("expand");
    expect(
      wrapper.get(".f-checkbox-root svg[data-icon]").attributes("data-icon"),
    ).toBe("check");
  });

  it("relays a field slot to every field", () => {
    const { service } = makeForm();
    const wrapper = mount(Form<FakePayload>, {
      props: { service },
      slots: {
        label: `<template #label="{ field }"><b>{{ field.label }}</b></template>`,
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper.findAll(".f-data-form-field b").map((b) => b.text()),
    ).toEqual(["Name", "Amount"]);
  });
});
