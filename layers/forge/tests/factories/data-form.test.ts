import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { createForm } from "../../app/factories/data-form";
import type { DataFormConfig } from "../../app/types/data-form";

interface TestForm {
  name: string;
  email: string;
  active: boolean;
}

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  active: z.boolean(),
});

const submitFn = vi.fn(async () => {});

const config: DataFormConfig<TestForm> = {
  title: "Test Form",
  fields: [
    { key: "name", type: "text", label: "Name", colspan: 6 },
    { key: "email", type: "email", label: "Email", colspan: 6 },
    { key: "active", type: "checkbox", label: "Active", colspan: 12 },
  ],
  schema,
  submit: submitFn,
  defaults: { name: "", email: "", active: false },
};

const makeForm = (id = "test") => createForm<TestForm>(id, config)();

describe("createForm", () => {
  describe("initialization", () => {
    it("returns a form with all expected properties", () => {
      const form = makeForm();
      expect(form.title).toBe("Test Form");
      expect(form.fields).toBe(config.fields);
      expect(form.values.value).toEqual({ name: "", email: "", active: false });
      expect(form.errors.value).toEqual({});
      expect(form.touched.value).toEqual(new Set());
    });

    it("init sets initialized", async () => {
      const form = makeForm("init-test");
      expect(form.initialized.value).toBe(false);
      await form.init();
      expect(form.initialized.value).toBe(true);
    });

    it("init is idempotent", async () => {
      const form = makeForm("idempotent-test");
      await form.init();
      const result = await form.init();
      expect(result).toBe(true);
    });
  });

  describe("setValue", () => {
    it("updates a specific field value", () => {
      const form = makeForm("setvalue-test");
      form.setValue("name", "Jane");
      expect(form.values.value.name).toBe("Jane");
    });

    it("preserves other values", () => {
      const form = makeForm("preserve-test");
      form.setValue("name", "Jane");
      form.setValue("email", "jane@test.com");
      expect(form.values.value.name).toBe("Jane");
      expect(form.values.value.email).toBe("jane@test.com");
    });
  });

  describe("touch", () => {
    it("marks a field as touched", () => {
      const form = makeForm("touch-test");
      form.touch("name");
      expect(form.touched.value.has("name")).toBe(true);
    });
  });

  describe("validation", () => {
    it("validate returns false and sets errors for invalid data", () => {
      const form = makeForm("validate-fail-test");
      const result = form.validate();
      expect(result).toBe(false);
      expect(form.errors.value.name).toBe("Name too short");
      expect(form.errors.value.email).toBe("Invalid email");
    });

    it("validate returns true for valid data", () => {
      const form = makeForm("validate-pass-test");
      form.setValue("name", "Jane");
      form.setValue("email", "jane@test.com");
      form.setValue("active", true);
      const result = form.validate();
      expect(result).toBe(true);
      expect(form.errors.value).toEqual({});
    });

    it("validate touches all fields", () => {
      const form = makeForm("validate-touch-test");
      form.validate();
      expect(form.touched.value.has("name")).toBe(true);
      expect(form.touched.value.has("email")).toBe(true);
      expect(form.touched.value.has("active")).toBe(true);
    });

    it("validateField sets error only for that field", () => {
      const form = makeForm("validate-field-test");
      form.validateField("name");
      expect(form.errors.value.name).toBe("Name too short");
      expect(form.errors.value.email).toBeUndefined();
    });

    it("validateField clears error when field becomes valid", () => {
      const form = makeForm("validate-clear-test");
      form.validateField("name");
      expect(form.errors.value.name).toBeDefined();
      form.setValue("name", "Jane");
      form.validateField("name");
      expect(form.errors.value.name).toBeUndefined();
    });

    it("valid computed reflects current state", () => {
      const form = makeForm("valid-computed-test");
      expect(form.valid.value).toBe(false);
      form.setValue("name", "Jane");
      form.setValue("email", "jane@test.com");
      form.setValue("active", true);
      expect(form.valid.value).toBe(true);
    });
  });

  describe("submit", () => {
    it("calls config.submit with parsed data on valid form", async () => {
      submitFn.mockClear();
      const form = makeForm("submit-valid-test");
      form.setValue("name", "Jane");
      form.setValue("email", "jane@test.com");
      form.setValue("active", true);
      await form.submit();
      expect(submitFn).toHaveBeenCalledWith({ name: "Jane", email: "jane@test.com", active: true });
      expect(form.submitted.value).toBe(true);
    });

    it("does not call config.submit on invalid form", async () => {
      submitFn.mockClear();
      const form = makeForm("submit-invalid-test");
      await form.submit();
      expect(submitFn).not.toHaveBeenCalled();
      expect(form.submitted.value).toBe(false);
    });

    it("sets submitting during async submit", async () => {
      submitFn.mockClear();
      let resolveSubmit: () => void;
      submitFn.mockImplementationOnce(() => new Promise<void>((r) => { resolveSubmit = r; }));
      const form = makeForm("submitting-test");
      form.setValue("name", "Jane");
      form.setValue("email", "jane@test.com");
      form.setValue("active", true);
      const promise = form.submit();
      expect(form.submitting.value).toBe(true);
      resolveSubmit!();
      await promise;
      expect(form.submitting.value).toBe(false);
    });
  });

  describe("reset", () => {
    it("resets all state to defaults", () => {
      const form = makeForm("reset-test");
      form.setValue("name", "Jane");
      form.touch("name");
      form.validate();
      form.reset();
      expect(form.values.value).toEqual({ name: "", email: "", active: false });
      expect(form.errors.value).toEqual({});
      expect(form.touched.value).toEqual(new Set());
      expect(form.submitted.value).toBe(false);
    });
  });

  describe("snapshot", () => {
    it("getSnapshot returns current values and touched", () => {
      const form = makeForm("snapshot-test");
      form.setValue("name", "Jane");
      form.touch("name");
      const snapshot = form.getSnapshot();
      expect(snapshot.values).toEqual({ name: "Jane", email: "", active: false });
      expect(snapshot.touched).toEqual(["name"]);
    });

    it("restoreSnapshot restores state", () => {
      const form = makeForm("restore-test");
      form.restoreSnapshot({ values: { name: "Restored" }, touched: ["name", "email"] });
      expect(form.values.value).toEqual({ name: "Restored" });
      expect(form.touched.value).toEqual(new Set(["name", "email"]));
    });
  });
});
