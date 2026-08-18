// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { z } from "zod";
import { defineEntity } from "../../../app/definitions/entity";
import { useForm } from "../../../app/factories/form";
import type { Service } from "../../../app/types/data/form";

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
      pt: { root: { label: "contact-form" } },
    });
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({
      root: { label: "contact-form" },
    });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = useForm(
      "f1",
      {
        ...definition,
        pt: { root: { label: "base" }, title: { label: "kept" } },
      },
      { pt: { root: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      root: { label: "override" },
      title: { label: "kept" },
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
