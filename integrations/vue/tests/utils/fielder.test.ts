import { describe, expect, it } from "vitest";
import { CalendarDate } from "@internationalized/date";
import { fielder } from "../../src/utils/fielder";
import { makeForm } from "#test/mount/form";
import { fakeField, fakeFields } from "#test/data/form";

/**
 * Fires a native `input` event through the recipe's listener, so the
 * handler sees a real `HTMLInputElement` target.
 */
const typeInto = (
  tag: "input" | "textarea",
  onInput: ((event: InputEvent) => void) | undefined,
  value: string,
  type = "text",
) => {
  if (!onInput) throw new Error("no input listener");
  const target = document.createElement(tag);
  if (target instanceof HTMLInputElement) target.type = type;
  target.addEventListener("input", (event) => {
    if (event instanceof InputEvent) onInput(event);
  });
  target.value = value;
  target.dispatchEvent(new InputEvent("input"));
};

describe("fielder", () => {
  it("maps each field type to its control", () => {
    const { service } = makeForm();
    const controls = fakeFields.map((field) => fielder(service, field).control);
    expect(controls).toEqual([
      "input",
      "input",
      "textarea",
      "select",
      "multiSelect",
      "checkbox",
      "radio",
      "datePicker",
      "tagsInput",
    ]);
  });

  it("seats the field's recipe and leaves the rest blank", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("name"));
    expect(recipes.input).toMatchObject({
      value: "Alice",
      type: "text",
      placeholder: "Your name",
    });
    expect(recipes.textarea).toEqual({});
    expect(recipes.select).toEqual({ options: [] });
    expect(recipes.datePicker).toEqual({ modelValue: undefined });
  });

  it("text input writes on input and validates on blur", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("name"));
    expect(recipes.input["aria-invalid"]).toBeUndefined();
    typeInto("input", recipes.input.onInput, "Bob");
    expect(service.payload.name).toBe("Bob");
    typeInto("input", recipes.input.onInput, "");
    recipes.input.onBlur?.(new FocusEvent("blur"));
    expect(service.touched.has("name")).toBe(true);
    expect(service.errors.name).toBe("Name is required");
    expect(
      fielder(service, fakeField("name")).recipes.input["aria-invalid"],
    ).toBe(true);
  });

  it("number input parses the value and clears on NaN", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("age"));
    expect(recipes.input).toMatchObject({
      type: "number",
      value: 30,
      min: 0,
      max: 120,
    });
    typeInto("input", recipes.input.onInput, "42", "number");
    expect(service.payload.age).toBe(42);
    typeInto("input", recipes.input.onInput, "", "number");
    expect(service.payload.age).toBeUndefined();
  });

  it("textarea writes on input", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("bio"));
    expect(recipes.textarea.rows).toBe(3);
    typeInto("textarea", recipes.textarea.onInput, "Hello");
    expect(service.payload.bio).toBe("Hello");
  });

  it("select maps the value to its option and writes a pick", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("role"));
    expect(recipes.select.modelValue).toEqual({
      value: "admin",
      label: "Admin",
    });
    recipes.select["onUpdate:modelValue"]?.({
      value: "member",
      label: "Member",
    });
    expect(service.payload.role).toBe("member");
    expect(service.touched.has("role")).toBe(true);
  });

  it("multi-select maps values to options both ways", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("teams"));
    expect(recipes.multiSelect.modelValue).toEqual([
      { value: "core", label: "Core" },
    ]);
    recipes.multiSelect["onUpdate:modelValue"]?.([
      { value: "design", label: "Design" },
    ]);
    expect(service.payload.teams).toEqual(["design"]);
    recipes.multiSelect["onUpdate:modelValue"]?.(undefined);
    expect(service.payload.teams).toEqual([]);
  });

  it("checkbox coerces to a boolean", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("active"));
    expect(recipes.checkbox.modelValue).toBe(false);
    recipes.checkbox["onUpdate:modelValue"]?.("indeterminate");
    expect(service.payload.active).toBe(false);
    recipes.checkbox["onUpdate:modelValue"]?.(true);
    expect(service.payload.active).toBe(true);
  });

  it("date round-trips between Date and calendar values", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("starts"));
    expect(recipes.datePicker.modelValue?.toString()).toBe("2025-01-15");
    recipes.datePicker["onUpdate:modelValue"]?.(new CalendarDate(2026, 6, 1));
    expect(service.payload.starts).toEqual(new Date(Date.UTC(2026, 5, 1)));
    recipes.datePicker["onUpdate:modelValue"]?.(undefined);
    expect(service.payload.starts).toBeUndefined();
  });

  it("radio and tags write their values", () => {
    const { service } = makeForm();
    const { radio } = fielder(service, fakeField("plan")).recipes;
    expect(radio.modelValue).toBe("free");
    radio["onUpdate:modelValue"]?.("pro");
    expect(service.payload.plan).toBe("pro");
    const { tagsInput } = fielder(service, fakeField("tags")).recipes;
    expect(tagsInput.modelValue).toEqual(["one"]);
    tagsInput["onUpdate:modelValue"]?.(["a", "b"]);
    expect(service.payload.tags).toEqual(["a", "b"]);
  });
});
