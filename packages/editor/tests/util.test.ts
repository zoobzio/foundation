import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { features, same, snapshot } from "../src/util";
import { hello } from "./data";

describe("features", () => {
  it("keeps every default when nothing is set", () => {
    const options = features({});
    expect(Object.values(options).every((v) => v === undefined)).toBe(true);
  });

  it("removes the extensions of a feature that is off", () => {
    expect(features({ lists: false })).toMatchObject({
      bulletList: false,
      orderedList: false,
      listItem: false,
      listKeymap: false,
    });
    expect(features({ code: false })).toMatchObject({
      code: false,
      codeBlock: false,
    });
    expect(features({ headings: false }).heading).toBe(false);
    expect(features({ links: false }).link).toBe(false);
    expect(features({ blockquote: false }).blockquote).toBe(false);
    expect(features({ rule: false }).horizontalRule).toBe(false);
    expect(features({ history: false }).undoRedo).toBe(false);
  });

  it("narrows heading levels when listed", () => {
    expect(features({ headings: [1, 2] }).heading).toEqual({ levels: [1, 2] });
  });

  it("a feature that is on keeps the defaults", () => {
    expect(features({ lists: true, code: true }).bulletList).toBeUndefined();
  });
});

describe("snapshot", () => {
  it("names every mark and node of the schema", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit],
      content: hello,
    });
    const active = snapshot(editor);
    for (const name of Object.keys(editor.schema.marks)) {
      expect(active).toHaveProperty(name);
    }
    for (const name of Object.keys(editor.schema.nodes)) {
      expect(active).toHaveProperty(name);
    }
    editor.destroy();
  });

  it("reports the marks at the selection", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit],
      content: hello,
    });
    editor.chain().setTextSelection({ from: 1, to: 6 }).toggleBold().run();
    expect(snapshot(editor).bold).toBe(true);
    expect(snapshot(editor).italic).toBe(false);
    expect(snapshot(editor).paragraph).toBe(true);
    editor.destroy();
  });
});

describe("same", () => {
  it("agrees on equal snapshots", () => {
    expect(same({ a: true, b: false }, { b: false, a: true })).toBe(true);
  });

  it("differs on a value", () => {
    expect(same({ a: true }, { a: false })).toBe(false);
  });

  it("differs on a key", () => {
    expect(same({ a: true }, { a: true, b: true })).toBe(false);
    expect(same({ a: true, b: true }, { a: true })).toBe(false);
  });
});
