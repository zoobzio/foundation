// Gold standard: widget composables. The composable composes store + service
// through the shim's Nuxt seams — tests assert the composition: live reactive
// views over shared keyed state, not re-tested service logic.
import { describe, expect, it, vi } from "vitest";
import { toValue } from "vue";
import { defineEntity } from "../../../app/definitions/entity";
import { usePreview } from "../../../app/factories/preview";
import type { Actions } from "../../../app/types/data/preview";
import { fakeRows } from "#test/data/table";
import type { FakeRow } from "#test/data/table";

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
      { ...definition, pt: { root: { label: "preview" } } },
      makeWiring(),
    );
    expect(widget.component).toBeDefined();
    expect(toValue(widget.settings)).toEqual({ root: { label: "preview" } });
  });

  it("merges wiring pt over the definition base per key", () => {
    const widget = usePreview(
      "p1",
      {
        ...definition,
        pt: { root: { label: "base" }, body: { label: "kept" } },
      },
      { ...makeWiring(), pt: { root: { label: "override" } } },
    );
    expect(toValue(widget.settings)).toEqual({
      root: { label: "override" },
      body: { label: "kept" },
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
