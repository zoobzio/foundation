// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container, the lifecycle wiring, and the
// hook relay — not the service's own logic.
import type { FormOptions } from "../../../app/types/form";
import type { Service } from "@zoobzio/form";
import type { FakePayload } from "#test/data/form";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createForm } from "../../../app/factories/form";
import { fakeDefaults, fakeFields, fakeSchema } from "#test/data/form";

const makeOptions = (
  overrides: Partial<FormOptions<FakePayload>> = {},
): FormOptions<FakePayload> => ({
  title: "Contact",
  fields: fakeFields,
  schema: fakeSchema,
  defaults: fakeDefaults,
  ...overrides,
});

describe("createForm", () => {
  it("returns a composable building a service over the defaults", () => {
    const useContact = createForm("contact", makeOptions());
    const contact = useContact();
    expect(contact.id).toBe("contact");
    expect(contact.config.title).toBe("Contact");
    expect(contact.payload).toEqual({ name: "Alice" });
    expect(contact.initialized).toBe(false);
    expect(contact.submitted).toBe(false);
  });

  it("seeds the first payload from the initial state, reset returns to defaults", () => {
    const contact = createForm(
      "contact",
      makeOptions({ initial: { payload: { name: "Draft", amount: 5 } } }),
    )();
    expect(contact.payload).toEqual({ name: "Draft", amount: 5 });
    contact.reset();
    expect(contact.payload).toEqual({ name: "Alice" });
  });

  it("wiring is optional: a local-only form validates and mutates", () => {
    const contact = createForm("contact", makeOptions())();
    contact.set("amount", 42);
    expect(contact.payload).toEqual({ name: "Alice", amount: 42 });
    expect(contact.validate()).toBe(true);
    contact.set("name", "");
    expect(contact.validate()).toBe(false);
    expect(contact.errors.name).toBeDefined();
  });

  it("runs the wired lifecycle actions and middleware", async () => {
    const init = vi.fn(async (service: Service<FakePayload>) => {
      service.set("amount", 1);
    });
    const submit = vi.fn(async () => {});
    const contact = createForm(
      "contact",
      makeOptions({
        init,
        submit,
        middleware: { name: (v) => v.trim() },
      }),
    )();
    await contact.initialize();
    expect(init).toHaveBeenCalledOnce();
    expect(contact.payload.amount).toBe(1);
    contact.set("name", "  Bob  ");
    expect(contact.payload.name).toBe("Bob");
    await contact.submit();
    expect(submit).toHaveBeenCalledOnce();
    expect(contact.submitted).toBe(true);
  });

  it("relays service events onto the Nuxt hook bus", async () => {
    const initialized = vi.fn();
    const submitted = vi.fn();
    const rejected = vi.fn();
    const restored = vi.fn();
    const reset = vi.fn();
    const failed = vi.fn();
    useNuxtApp().hooks.addHooks({
      "form:initialized": initialized,
      "form:submitted": submitted,
      "form:rejected": rejected,
      "form:restored": restored,
      "form:reset": reset,
      "form:failed": failed,
    });
    const cause = new Error("boom");
    const submit = vi
      .fn<() => Promise<void>>()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(cause);
    const contact = createForm("contact", makeOptions({ submit }))();

    await contact.initialize();
    expect(initialized).toHaveBeenCalledWith({
      id: "contact",
      data: { name: "Alice" },
    });

    await contact.submit();
    expect(rejected).toHaveBeenCalledWith({
      id: "contact",
      data: { name: "Alice" },
      errors: { amount: "Invalid input: expected number, received undefined" },
    });

    contact.set("amount", 10);
    await contact.submit();
    expect(submitted).toHaveBeenCalledWith({
      id: "contact",
      data: { name: "Alice", amount: 10 },
    });

    contact.restore({ name: "Carol", amount: 2 });
    expect(restored).toHaveBeenCalledWith({
      id: "contact",
      data: { name: "Carol", amount: 2 },
    });

    contact.reset();
    expect(reset).toHaveBeenCalledWith({
      id: "contact",
      data: { name: "Alice" },
    });

    contact.set("amount", 10);
    await expect(contact.submit()).rejects.toBe(cause);
    expect(failed).toHaveBeenCalledWith({
      id: "contact",
      stage: "submit",
      cause,
    });
  });

  it("every call of one composable shares the id's state", () => {
    const useContact = createForm("contact", makeOptions());
    const a = useContact();
    const b = useContact();
    expect(a).not.toBe(b);
    a.set("name", "Carol");
    expect(b.payload.name).toBe("Carol");
  });

  it("different ids stay independent", () => {
    const a = createForm("contact", makeOptions())();
    const b = createForm("profile", makeOptions())();
    a.set("name", "Dave");
    expect(b.payload.name).toBe("Alice");
  });
});
