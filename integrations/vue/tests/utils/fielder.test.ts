import { describe, expect, it } from "vitest";
import { toRaw } from "vue";
import { CalendarDate } from "@internationalized/date";
import { fielder } from "../../src/utils/fielder";
import { makeForm } from "#test/mount/form";
import { fakeField, fakeFields, fakeFile } from "#test/data/form";

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
      "input",
      "input",
      "input",
      "input",
      "input",
      "fileInput",
      "fileInput",
      "richText",
    ]);
  });

  it("seats the field's recipe and leaves the rest blank", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("name"));
    expect(recipes.input).toMatchObject({
      value: "Alice",
      type: "text",
      placeholder: "Your name",
      maxlength: 40,
    });
    expect(recipes.textarea).toEqual({});
    expect(recipes.select).toEqual({ options: [] });
    expect(recipes.datePicker).toEqual({ modelValue: undefined });
    expect(recipes.fileInput).toEqual({});
    expect(recipes.richText).toEqual({});
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

  it("tel and url render native inputs of their type", () => {
    const { service } = makeForm();
    const phone = fielder(service, fakeField("phone"));
    expect(phone.control).toBe("input");
    expect(phone.recipes.input).toMatchObject({
      type: "tel",
      value: "+1 555 0100",
      placeholder: "+1 555 0100",
    });
    typeInto("input", phone.recipes.input.onInput, "555 0199", "tel");
    expect(service.payload.phone).toBe("555 0199");
    const site = fielder(service, fakeField("site"));
    expect(site.recipes.input).toMatchObject({
      type: "url",
      value: "https://example.com",
    });
  });

  it("temporal fields map to native types and carry string bounds", () => {
    const { service } = makeForm();
    const alarm = fielder(service, fakeField("alarm")).recipes.input;
    expect(alarm).toMatchObject({
      type: "time",
      value: "07:30",
      min: "06:00",
      max: "22:00",
      step: 900,
    });
    const meeting = fielder(service, fakeField("meeting")).recipes.input;
    expect(meeting).toMatchObject({
      type: "datetime-local",
      value: "2025-03-04T09:00",
    });
    const birthday = fielder(service, fakeField("birthday")).recipes.input;
    expect(birthday).toMatchObject({
      type: "date",
      value: "1990-05-20",
      min: "1900-01-01",
      max: "2025-12-31",
    });
  });

  it("temporal input writes the string and clears on empty", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("birthday"));
    typeInto("input", recipes.input.onInput, "2001-02-03", "date");
    expect(service.payload.birthday).toBe("2001-02-03");
    typeInto("input", recipes.input.onInput, "", "date");
    expect(service.payload.birthday).toBeUndefined();
    recipes.input.onBlur?.(new FocusEvent("blur"));
    expect(service.touched.has("birthday")).toBe(true);
    expect(service.errors.birthday).toBeDefined();
  });

  it("textarea forwards its max length", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, {
      type: "textarea",
      key: "bio",
      label: "Bio",
      maxLength: 200,
    });
    expect(recipes.textarea.maxlength).toBe(200);
  });

  it("date forwards its bounds as calendar values", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, {
      type: "date",
      key: "starts",
      label: "Starts",
      required: true,
      minDate: new Date(Date.UTC(2025, 0, 1)),
      maxDate: new Date(Date.UTC(2025, 11, 31)),
    });
    expect(recipes.datePicker.minValue?.toString()).toBe("2025-01-01");
    expect(recipes.datePicker.maxValue?.toString()).toBe("2025-12-31");
    expect(recipes.datePicker.required).toBe(true);
    const bare = fielder(service, fakeField("starts")).recipes.datePicker;
    expect(bare.minValue).toBeUndefined();
    expect(bare.maxValue).toBeUndefined();
  });

  it("checkbox, multi-select, and tags forward required", () => {
    const { service } = makeForm();
    const required = (key: "active" | "teams" | "tags") =>
      fielder(service, { ...fakeField(key), required: true }).recipes;
    expect(required("active").checkbox.required).toBe(true);
    expect(required("teams").multiSelect.required).toBe(true);
    expect(required("tags").tagsInput.required).toBe(true);
  });

  it("file wraps the one file as a list and writes the first pick", () => {
    const { service } = makeForm();
    const { control, recipes } = fielder(service, fakeField("avatar"));
    expect(control).toBe("fileInput");
    expect(recipes.fileInput).toMatchObject({
      multiple: false,
      accept: "image/*",
    });
    expect(recipes.fileInput.modelValue?.map((f) => f.name)).toEqual([
      "avatar.png",
    ]);
    const next = fakeFile("next.png");
    recipes.fileInput["onUpdate:modelValue"]?.([next]);
    // happy-dom's File lacks the `[object File]` tag browsers give it, so
    // the reactive container proxies it here and nowhere else.
    expect(toRaw(service.payload.avatar)).toBe(next);
    expect(service.touched.has("avatar")).toBe(true);
    recipes.fileInput["onUpdate:modelValue"]?.([]);
    expect(service.payload.avatar).toBeUndefined();
    expect(service.errors.avatar).toBeDefined();
  });

  it("file checks the pick against the schema", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("avatar"));
    recipes.fileInput["onUpdate:modelValue"]?.([
      fakeFile("doc.pdf", "application/pdf"),
    ]);
    expect(service.errors.avatar).toBe("PNG only");
  });

  it("multi-file passes the list both ways", () => {
    const { service } = makeForm();
    const { control, recipes } = fielder(service, fakeField("attachments"));
    expect(control).toBe("fileInput");
    expect(recipes.fileInput).toMatchObject({ multiple: true, modelValue: [] });
    const picked = [fakeFile("a.txt"), fakeFile("b.txt"), fakeFile("c.txt")];
    recipes.fileInput["onUpdate:modelValue"]?.(picked);
    expect(service.payload.attachments).toEqual(picked);
    expect(service.errors.attachments).toBe("Two at most");
    expect(
      fielder(service, fakeField("attachments")).recipes.fileInput.modelValue,
    ).toEqual(picked);
  });

  it("richtext seats the HTML, the features, and the field's id", () => {
    const { service } = makeForm();
    const { control, recipes } = fielder(service, fakeField("body"));
    expect(control).toBe("richText");
    expect(recipes.richText).toMatchObject({
      modelValue: "<p>Hello</p>",
      id: "body",
      features: { headings: [2], lists: false },
    });
    expect(recipes.richText.pt?.content?.["aria-invalid"]).toBeUndefined();
  });

  it("richtext writes on update and validates on blur", () => {
    const { service } = makeForm();
    const { recipes } = fielder(service, fakeField("body"));
    recipes.richText["onUpdate:modelValue"]?.("<p>Edited</p>");
    expect(service.payload.body).toBe("<p>Edited</p>");
    expect(service.touched.has("body")).toBe(false);
    recipes.richText["onUpdate:modelValue"]?.("");
    recipes.richText.onBlur?.(new FocusEvent("blur"));
    expect(service.touched.has("body")).toBe(true);
    expect(service.errors.body).toBe("Body is required");
    const invalid = fielder(service, fakeField("body")).recipes.richText;
    expect(invalid.modelValue).toBe("");
    expect(invalid.pt?.content?.["aria-invalid"]).toBe(true);
  });

  it("file and richtext forward disabled and required", () => {
    const { service } = makeForm();
    const avatar = fielder(service, {
      ...fakeField("avatar"),
      disabled: true,
      required: true,
    }).recipes.fileInput;
    expect(avatar).toMatchObject({ disabled: true, required: true });
    const body = fielder(service, {
      ...fakeField("body"),
      disabled: true,
      required: true,
    }).recipes.richText;
    expect(body).toMatchObject({ disabled: true, required: true });
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
