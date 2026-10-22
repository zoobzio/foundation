// A pure projection: bound actions in, the two headless halves out. Each
// test asserts both halves and the key correspondence between them.
import { describe, expect, it, vi } from "vitest";
import { split } from "../../../app/utils/actions";

describe("split", () => {
  it("separates descriptors from handlers under the same keys", () => {
    const edit = vi.fn();
    const remove = vi.fn();
    const { descriptors, handlers } = split({
      edit: { label: "Edit", action: edit },
      remove: { label: "Delete", action: remove },
    });
    expect(descriptors).toEqual({
      edit: { label: "Edit" },
      remove: { label: "Delete" },
    });
    expect(handlers).toEqual({ edit, remove });
  });

  it("keeps every descriptor field except the handler", () => {
    const { descriptors } = split({
      edit: { label: "Edit", hint: "Open the editor", action: vi.fn() },
    });
    expect(descriptors).toEqual({
      edit: { label: "Edit", hint: "Open the editor" },
    });
  });

  it("yields empty halves when no record is given", () => {
    expect(split()).toEqual({ descriptors: {}, handlers: {} });
    expect(split(undefined)).toEqual({ descriptors: {}, handlers: {} });
  });
});
