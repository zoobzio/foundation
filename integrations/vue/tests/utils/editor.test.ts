import { describe, expect, it } from "vitest";
import { editorTools } from "../../src/utils/editor";
import { makeEditor } from "#test/mount/editor";
import { hello } from "#test/data/editor";

const keys = (tools: { key: string }[]) => tools.map((t) => t.key);

describe("editorTools", () => {
  it("offers every mark and node of the default feature set, then history", () => {
    const { service } = makeEditor();
    expect(keys(editorTools(service))).toEqual([
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
      "heading-1",
      "heading-2",
      "heading-3",
      "heading-4",
      "heading-5",
      "heading-6",
      "bulletList",
      "orderedList",
      "blockquote",
      "codeBlock",
      "horizontalRule",
      "undo",
      "redo",
    ]);
  });

  it("follows the feature set", () => {
    const { service } = makeEditor({
      headings: [1, 2],
      lists: false,
      code: false,
      rule: false,
      history: false,
    });
    expect(keys(editorTools(service))).toEqual([
      "bold",
      "italic",
      "underline",
      "strike",
      "heading-1",
      "heading-2",
      "blockquote",
    ]);
  });

  it("reports the active marks and the heading level at the selection", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    service.toggle("bold");
    service.block("heading", { level: 2 });
    const tools = editorTools(service);
    const by = (key: string) => tools.find((t) => t.key === key);
    expect(by("bold")?.active).toBe(true);
    expect(by("italic")?.active).toBe(false);
    expect(by("heading-2")?.active).toBe(true);
    expect(by("heading-1")?.active).toBe(false);
  });

  it("each tool runs its command", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    const tools = editorTools(service);
    const by = (key: string) => tools.find((t) => t.key === key);
    by("italic")?.run();
    expect(service.active.italic).toBe(true);
    by("bulletList")?.run();
    expect(service.json.content?.[0]?.type).toBe("bulletList");
    by("undo")?.run();
    expect(service.json.content?.[0]?.type).toBe("paragraph");
  });
});
