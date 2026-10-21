// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { useNuxtApp } from "#imports";
import { defineEntity } from "../../../app/definitions/entity";
import { usePreview } from "../../../app/factories/preview";
import type { Actions } from "../../../app/types/data/preview";
import { fakeRows } from "#test/data/rows";
import type { FakeRow } from "#test/data/rows";

const rows = defineEntity<FakeRow>();

const definition = rows.definePreview({
  fields: [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ],
  content: { type: "code", key: "name", language: "text" },
});

const subject = fakeRows[0] as FakeRow;

const makeWiring = () => ({
  fetch: vi.fn<Actions<FakeRow>["fetch"]>(async () => subject),
});

describe("usePreview", () => {
  it("yields the widget triple resolving pt into settings", () => {
    const widget = usePreview(
      "p1",
      { ...definition, pt: { external: { label: "preview" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({
      external: { label: "preview" },
    });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = usePreview(
      "p1",
      {
        ...definition,
        pt: { external: { label: "base" }, copy: { label: "kept" } },
      },
      { ...makeWiring(), pt: { external: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      external: { label: "override" },
      copy: { label: "kept" },
    });
  });

  it("builds a preview over fresh store state", () => {
    const preview = usePreview("p1", definition, makeWiring()).service;
    expect(preview.id).toBe("p1");
    expect(preview.data).toBeNull();
    expect(preview.initialized).toBe(false);
    expect(preview.contentValue).toBe("");
  });

  it("init drives the fetch pipeline into the reactive views", async () => {
    const wiring = makeWiring();
    const preview = usePreview("p1", definition, wiring).service;
    await preview.init();
    expect(preview.data).toEqual(subject);
    expect(preview.initialized).toBe(true);
    expect(preview.contentValue).toBe(subject.name);
    expect(preview.fieldValue("status")).toBe(subject.status);
    expect(wiring.fetch).toHaveBeenCalledOnce();
  });

  it("routes service events onto the Nuxt hook bus", async () => {
    const loaded = vi.fn();
    useNuxtApp().hooks.addHooks({ "preview:loaded": loaded });
    const wiring = makeWiring();
    const preview = usePreview("p1", definition, wiring).service;
    await preview.init();
    expect(loaded).toHaveBeenCalledWith({ id: "p1" });
    wiring.fetch.mockRejectedValueOnce(new Error("boom"));
    await expect(preview.fetch()).rejects.toThrow("boom");
    expect(loaded).toHaveBeenCalledTimes(2);
  });

  it("same id shares state across instances", async () => {
    const a = usePreview("p1", definition, makeWiring()).service;
    const b = usePreview("p1", definition, makeWiring()).service;
    await a.init();
    expect(b.data).toEqual(subject);
    expect(b.initialized).toBe(true);
  });

  it("different ids stay independent", async () => {
    const a = usePreview("p1", definition, makeWiring()).service;
    const b = usePreview("p2", definition, makeWiring()).service;
    await a.init();
    expect(b.initialized).toBe(false);
    expect(b.data).toBeNull();
  });
});
