// Gold standard: factories. `create*` splits the options once and returns the
// id-scoped composable; the tests assert that composition through the shim's
// Nuxt seams — the shared keyed container and the hook relay — not the
// service's own logic.
import type { CodeOptions } from "../../../app/types/code";
import type { Doc } from "@zoobzio/code";

import { describe, expect, it, vi } from "vitest";
import { EditorState } from "@codemirror/state";
import { useNuxtApp } from "#app";
import { createCode } from "../../../app/factories/code";
import { hello, passthrough } from "#test/data/code";

const makeOptions = (
  overrides: Partial<CodeOptions<Doc, Doc>> = {},
): CodeOptions<Doc, Doc> => ({
  read: passthrough.read,
  write: passthrough.write,
  ...overrides,
});

describe("createCode", () => {
  it("returns a composable building a service over the shared store", () => {
    const useReadme = createCode("readme", makeOptions());
    const readme = useReadme();
    expect(readme.id).toBe("readme");
    expect(readme.revision).toBe(0);
    expect(readme.empty).toBe(true);
    expect(readme.mounted).toBe(false);
  });

  it("splits the feature set from the actions", () => {
    const tabs = EditorState.tabSize.of(2);
    const readme = createCode(
      "readme",
      makeOptions({ history: false, extensions: [tabs] }),
    )();
    expect(readme.config).toEqual({ history: false });
    expect(readme.context.extensions).toEqual([tabs]);
  });

  it("reads and writes through the wired seams", () => {
    const read = vi.fn(passthrough.read);
    const write = vi.fn(passthrough.write);
    const readme = createCode("readme", makeOptions({ read, write }))();
    readme.load(hello);
    expect(read).toHaveBeenCalledWith(hello, readme.context);
    expect(readme.document).toBe(hello);
    expect(write).toHaveBeenCalledWith(hello, readme.context);
  });

  it("relays service events onto the Nuxt hook bus", () => {
    const loaded = vi.fn();
    const updated = vi.fn();
    useNuxtApp().hooks.addHooks({
      "code:loaded": loaded,
      "code:updated": updated,
    });
    const readme = createCode("readme", makeOptions())();
    readme.load(hello);
    expect(loaded).toHaveBeenCalledWith({ id: "readme", revision: 1 });
    expect(updated).not.toHaveBeenCalled();
    readme.insert("!", hello.length);
    expect(updated).toHaveBeenCalledWith({ id: "readme", revision: 2 });
  });

  it("logs each relayed event under the service's id", () => {
    const readme = createCode("readme", makeOptions())();
    readme.load(hello);
    expect(useNuxtApp().$logger("readme").debug).toHaveBeenCalledWith(
      "Code loaded",
      { id: "readme", revision: 1 },
    );
  });

  it("every call of one composable shares the id's container", () => {
    const useReadme = createCode("readme", makeOptions());
    const a = useReadme();
    const b = useReadme();
    expect(a).not.toBe(b);
    a.load(hello);
    expect(b.revision).toBe(1);
  });

  it("different ids stay independent", () => {
    const a = createCode("readme", makeOptions())();
    const b = createCode("notes", makeOptions())();
    a.load(hello);
    expect(b.revision).toBe(0);
  });
});
