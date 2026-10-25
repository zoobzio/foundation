// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container and the hook relay — not the
// service's own logic.
import type { EditorOptions } from "../../../app/types/editor";
import type { Doc } from "@zoobzio/editor";

import { describe, expect, it, vi } from "vitest";
import { useNuxtApp } from "#app";
import { createEditor } from "../../../app/factories/editor";
import { hello, paragraph, passthrough } from "#test/data/editor";

const makeOptions = (
  overrides: Partial<EditorOptions<Doc, Doc>> = {},
): EditorOptions<Doc, Doc> => ({
  read: passthrough.read,
  write: passthrough.write,
  ...overrides,
});

describe("createEditor", () => {
  it("returns a composable building a service over the shared store", () => {
    const useBody = createEditor("body", makeOptions());
    const body = useBody();
    expect(body.id).toBe("body");
    expect(body.revision).toBe(0);
    expect(body.empty).toBe(true);
    expect(body.mounted).toBe(false);
  });

  it("splits the feature set from the actions", () => {
    const body = createEditor(
      "body",
      makeOptions({ lists: false, headings: [1, 2] }),
    )();
    expect(body.config).toEqual({ lists: false, headings: [1, 2] });
    expect(body.context.schema.nodes.bulletList).toBeUndefined();
    expect(body.context.schema.nodes.heading).toBeDefined();
  });

  it("reads and writes through the wired seams", () => {
    const read = vi.fn(passthrough.read);
    const write = vi.fn(passthrough.write);
    const body = createEditor("body", makeOptions({ read, write }))();
    body.load(hello);
    expect(read).toHaveBeenCalledWith(hello, body.context);
    expect(body.document).toEqual(hello);
    expect(write).toHaveBeenCalledWith(hello, body.context);
  });

  it("relays service events onto the Nuxt hook bus", () => {
    const loaded = vi.fn();
    const updated = vi.fn();
    useNuxtApp().hooks.addHooks({
      "editor:loaded": loaded,
      "editor:updated": updated,
    });
    const body = createEditor("body", makeOptions())();
    body.load(hello);
    expect(loaded).toHaveBeenCalledWith({ id: "body", revision: 1 });
    expect(updated).not.toHaveBeenCalled();
    body.insert(paragraph("More"));
    expect(updated).toHaveBeenCalledWith({ id: "body", revision: 2 });
  });

  it("logs each relayed event under the service's id", () => {
    const body = createEditor("body", makeOptions())();
    body.load(hello);
    expect(useNuxtApp().$logger("body").debug).toHaveBeenCalledWith(
      "Editor loaded",
      { id: "body", revision: 1 },
    );
  });

  it("every call of one composable shares the id's container", () => {
    const useBody = createEditor("body", makeOptions());
    const a = useBody();
    const b = useBody();
    expect(a).not.toBe(b);
    a.load(hello);
    expect(b.revision).toBe(1);
  });

  it("different ids stay independent", () => {
    const a = createEditor("body", makeOptions())();
    const b = createEditor("bio", makeOptions())();
    a.load(hello);
    expect(b.revision).toBe(0);
  });
});
