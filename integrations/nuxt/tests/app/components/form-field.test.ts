// The form field wrapper: the layer's controls behind the control parts.
import type { Field } from "@zoobzio/form";
import type { FakePayload } from "#test/data/form";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FormField from "../../../app/components/form-field";
import { makeForm } from "#test/mount/form";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("form field wrapper", () => {
  it("renders a tags input field through the layer's TagsInput", () => {
    const field = {
      type: "tags-input",
      key: "name",
      label: "Names",
    } as unknown as Field<FakePayload>;
    const { service } = makeForm({ fields: [field] });
    service.set("name", ["a", "b"] as never);
    const wrapper = mount(FormField<FakePayload>, {
      props: { service, field },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(
      wrapper.findAll('.f-tags-input-item-delete svg[data-icon="remove"]'),
    ).toHaveLength(2);
  });

  it("reads the field's label, hint and placeholder from the contract", () => {
    const field = {
      type: "text",
      key: "name",
      label: "form.submit",
      hint: "form.reset",
      placeholder: "select.placeholder",
    } as unknown as Field<FakePayload>;
    const { service } = makeForm({ fields: [field] });
    const wrapper = mount(FormField<FakePayload>, {
      props: { service, field },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.get("label").text()).toBe("Submit");
    expect(wrapper.get(".f-data-form-field-hint").text()).toBe("Reset");
    expect(wrapper.get("input").attributes("placeholder")).toBe(
      "Select an option",
    );
  });
});
