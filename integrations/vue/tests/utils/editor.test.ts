import { describe, expect, it } from "vitest";
import {
  editorBlock,
  editorBlocks,
  editorGroups,
  editorTools,
} from "../../src/utils/editor";
import { makeEditor } from "#test/mount/editor";
import { hello } from "#test/data/editor";

const keys = (tools: { key: string }[]) => tools.map((t) => t.key);

describe("editorTools", () => {
  it("offers every mark and node of the default feature set, then history", () => {
    const { service } = makeEditor();
    expect(keys(editorTools(service))).toEqual([
      "heading-1",
      "heading-2",
      "heading-3",
      "heading-4",
      "heading-5",
      "heading-6",
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
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
      "heading-1",
      "heading-2",
      "bold",
      "italic",
      "underline",
      "strike",
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

  it("gives each tool its kind and group", () => {
    const { service } = makeEditor();
    const tools = editorTools(service);
    const by = (key: string) => tools.find((t) => t.key === key)!;
    expect(by("bold")).toMatchObject({ kind: "toggle", group: "marks" });
    expect(by("heading-3")).toMatchObject({
      kind: "toggle",
      group: "headings",
    });
    expect(by("orderedList")).toMatchObject({ kind: "toggle", group: "lists" });
    expect(by("blockquote")).toMatchObject({ kind: "toggle", group: "blocks" });
    expect(by("horizontalRule")).toMatchObject({
      kind: "action",
      group: "blocks",
    });
    expect(by("undo")).toMatchObject({ kind: "action", group: "history" });
    expect(by("heading-3").label).toBe("Heading 3");
  });

  it("disables a tool whose command would not apply", () => {
    const { service } = makeEditor();
    service.load(hello);
    const before = editorTools(service);
    const by = (tools: typeof before, key: string) =>
      tools.find((t) => t.key === key)!;
    expect(by(before, "undo").disabled).toBe(true);
    expect(by(before, "redo").disabled).toBe(true);
    expect(by(before, "bold").disabled).toBe(false);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    service.block("codeBlock");
    const after = editorTools(service);
    expect(by(after, "undo").disabled).toBe(false);
    expect(by(after, "bold").disabled).toBe(true);
    expect(by(after, "codeBlock").disabled).toBe(false);
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

describe("editorGroups", () => {
  it("groups the tools in toolbar order, leaving out an empty group", () => {
    const { service } = makeEditor({ headings: false, history: false });
    const groups = editorGroups(editorTools(service));
    expect(groups.map((g) => g.name)).toEqual(["marks", "lists", "blocks"]);
    expect(groups[0]?.tools.map((t) => t.key)).toEqual([
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
    ]);
    expect(groups[2]?.tools.map((t) => t.key)).toEqual([
      "blockquote",
      "codeBlock",
      "horizontalRule",
    ]);
  });
});

describe("editorBlocks", () => {
  it("offers the paragraph, then one entry per heading tool", () => {
    const { service } = makeEditor({ headings: [1, 2, 3] });
    const blocks = editorBlocks(editorTools(service));
    expect(blocks.map((b) => [b.value, b.label])).toEqual([
      ["paragraph", "Paragraph"],
      ["heading-1", "Heading 1"],
      ["heading-2", "Heading 2"],
      ["heading-3", "Heading 3"],
    ]);
  });

  it("offers the paragraph alone with no heading tool", () => {
    const { service } = makeEditor({ headings: false });
    expect(editorBlocks(editorTools(service)).map((b) => b.value)).toEqual([
      "paragraph",
    ]);
  });
});

describe("editorBlock", () => {
  it("is the paragraph until a heading is active, then that heading", () => {
    const { service } = makeEditor({ headings: [1, 2] });
    service.load(hello);
    const tools = editorTools(service);
    expect(editorBlock(tools, editorBlocks(tools)).value).toBe("paragraph");
    service.block("heading", { level: 2 });
    const after = editorTools(service);
    expect(editorBlock(after, editorBlocks(after)).value).toBe("heading-2");
  });
});
