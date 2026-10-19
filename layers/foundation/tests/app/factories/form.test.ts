// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { z } from "zod";
import { useNuxtApp } from "#imports";
import { defineEntity } from "../../../app/definitions/entity";
import { useForm } from "../../../app/factories/form";
import type { Actions, Service } from "../../../app/types/data/form";

type Payload = { name: string; amount: number };

const payloads = defineEntity<Payload>();

const definition = payloads.defineForm({
  title: "Contact",
  fields: [
    { type: "text", key: "name", label: "Name" },
    { type: "number", key: "amount", label: "Amount" },
  ],
  schema: z.object({ name: z.string().min(1), amount: z.number() }),
  defaults: { name: "Alice" },
});

describe("useForm", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = useForm("f1", {
      ...definition,
      pt: { scroller: { scrollHideDelay: 100 } },
    });
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({
      scroller: { scrollHideDelay: 100 },
    });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useForm(
      "f1",
      {
        ...definition,
        pt: { scroller: { scrollHideDelay: 1, type: "hover" } },
      },
      { pt: { scroller: { scrollHideDelay: 2 } } },
    );
    expect(toValue(widget.settings)).toEqual({
      scroller: { scrollHideDelay: 2, type: "hover" },
    });
  });

  it("builds a form over fresh store state seeded from defaults", () => {
    const form = useForm("f1", definition).service;
    expect(form.id).toBe("f1");
    expect(form.payload).toEqual({ name: "Alice" });
    expect(form.initialized).toBe(false);
    expect(form.submitted).toBe(false);
  });

  it("wiring is optional — a local-only form validates and mutates", () => {
    const form = useForm("f1", definition).service;
    form.set("amount", 42);
    expect(form.payload).toEqual({ name: "Alice", amount: 42 });
    expect(form.validate()).toBe(true);
    form.set("name", "");
    expect(form.validate()).toBe(false);
    expect(form.errors.name).toBeDefined();
  });

  it("submit lifecycle runs the wired action against valid payload", async () => {
    const submit = vi.fn(async (service: Service<Payload>) => {
      void service.payload;
    });
    const form = useForm("f1", definition, { submit }).service;
    form.set("amount", 10);
    await form.submit();
    expect(submit).toHaveBeenCalledOnce();
    expect(form.submitted).toBe(true);
  });

  it("middleware transforms values on set", () => {
    const form = useForm("f1", definition, {
      middleware: { name: (v) => v.trim() },
    }).service;
    form.set("name", "  Bob  ");
    expect(form.payload.name).toBe("Bob");
  });

  it("routes service events onto the Nuxt hook bus", async () => {
    const initialized = vi.fn();
    const submitted = vi.fn();
    const rejected = vi.fn();
    const reset = vi.fn();
    const failed = vi.fn();
    useNuxtApp().hooks.addHooks({
      "form:initialized": initialized,
      "form:submitted": submitted,
      "form:rejected": rejected,
      "form:reset": reset,
      "form:failed": failed,
    });
    const cause = new Error("boom");
    const submit = vi
      .fn<NonNullable<Actions<Payload>["submit"]>>()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(cause);
    const form = useForm("f1", definition, { submit }).service;

    await form.initialize();
    expect(initialized).toHaveBeenCalledWith({
      id: "f1",
      data: { name: "Alice" },
    });

    await form.submit();
    expect(rejected).toHaveBeenCalledWith({
      id: "f1",
      data: { name: "Alice" },
      errors: { amount: "Required" },
    });

    form.set("amount", 10);
    await form.submit();
    expect(submitted).toHaveBeenCalledWith({
      id: "f1",
      data: { name: "Alice", amount: 10 },
    });

    form.reset();
    expect(reset).toHaveBeenCalledWith({ id: "f1", data: { name: "Alice" } });

    form.set("amount", 10);
    await expect(form.submit()).rejects.toBe(cause);
    expect(failed).toHaveBeenCalledWith({ id: "f1", stage: "submit", cause });
  });

  it("same id shares state across instances", () => {
    const a = useForm("f1", definition).service;
    const b = useForm("f1", definition).service;
    a.set("name", "Carol");
    expect(b.payload.name).toBe("Carol");
  });

  it("different ids stay independent", () => {
    const a = useForm("f1", definition).service;
    const b = useForm("f2", definition).service;
    a.set("name", "Dave");
    expect(b.payload.name).toBe("Alice");
  });
});
