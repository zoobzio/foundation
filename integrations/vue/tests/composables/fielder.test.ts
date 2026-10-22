import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useFielder } from "../../src/composables/fielder";
import { makeForm } from "#test/mount/form";
import { fakeField } from "#test/data/form";

describe("useFielder", () => {
  it("resolves the field's control and recipes as a computed", () => {
    const { service } = makeForm();
    const resolved = useFielder(() => ({
      form: service,
      field: fakeField("role"),
    }));
    expect(resolved.value.control).toBe("select");
    expect(resolved.value.recipes.select.modelValue).toEqual({
      value: "admin",
      label: "Admin",
    });
  });

  it("follows the service: the recipe tracks the payload and touched state", () => {
    const { service } = makeForm();
    const resolved = useFielder(() => ({
      form: service,
      field: fakeField("name"),
    }));
    expect(resolved.value.recipes.input.value).toBe("Alice");
    service.set("name", "");
    expect(resolved.value.recipes.input.value).toBe("");
    service.check("name");
    expect(resolved.value.recipes.input["aria-invalid"]).toBeUndefined();
    service.touch("name");
    expect(resolved.value.recipes.input["aria-invalid"]).toBe(true);
  });

  it("follows the source: a new field resolves to its own control", () => {
    const { service } = makeForm();
    const field = ref(fakeField("name"));
    const resolved = useFielder(() => ({ form: service, field: field.value }));
    expect(resolved.value.control).toBe("input");
    field.value = fakeField("active");
    expect(resolved.value.control).toBe("checkbox");
    expect(resolved.value.recipes.checkbox.modelValue).toBe(false);
  });
});
