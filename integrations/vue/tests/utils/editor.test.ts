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
      "link",
      "bulletList",
      "orderedList",
      "blockquote",
      "codeBlock",
      "horizontalRule",
      "image",
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
      links: false,
      images: false,
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
    expect(by("link")).toMatchObject({ kind: "prompt", group: "marks" });
    expect(by("image")).toMatchObject({ kind: "prompt", group: "media" });
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

describe("the link tool", () => {
  const link = (service: ReturnType<typeof makeEditor>["service"]) =>
    editorTools(service).find((t) => t.key === "link")!;

  it("asks for an address and links the selection with it", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    const tool = link(service);
    expect(tool.active).toBe(false);
    expect(tool.clear).toBeUndefined();
    expect(tool.fields?.()).toEqual([
      { key: "href", label: "URL", value: "", url: true, required: false },
    ]);
    tool.run({ href: "  https://example.com  " });
    expect(service.attributes("link").href).toBe("https://example.com");
  });

  it("opens on the address at the selection, and removes the link", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    service.link("https://example.com");
    service.run((chain) => chain.setTextSelection(3));
    const tool = link(service);
    expect(tool.active).toBe(true);
    expect(tool.fields?.()[0]?.value).toBe("https://example.com");
    tool.clear?.();
    expect(service.json).toEqual(hello);
  });

  it("an address typed away takes the link away", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    service.link("https://example.com");
    link(service).run({ href: " " });
    expect(service.active.link).toBe(false);
  });

  it("is off where a mark would not apply", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.block("codeBlock");
    expect(link(service).disabled).toBe(true);
  });
});

describe("the image tool", () => {
  const image = (service: ReturnType<typeof makeEditor>["service"]) =>
    editorTools(service).find((t) => t.key === "image")!;

  it("asks for an address and a text, and inserts the image inline", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection(6));
    const tool = image(service);
    expect(tool.active).toBe(false);
    expect(tool.clear).toBeUndefined();
    expect(tool.fields?.()).toEqual([
      { key: "src", label: "URL", value: "", url: true, required: true },
      { key: "alt", label: "Alt text", value: "", url: false, required: false },
    ]);
    tool.run({ src: "/a.png", alt: "A" });
    expect(service.json.content).toHaveLength(1);
    expect(service.json.content?.[0]?.content?.[1]).toMatchObject({
      type: "image",
      attrs: { src: "/a.png", alt: "A" },
    });
  });

  it("inserts nothing with no address", () => {
    const { service } = makeEditor();
    service.load(hello);
    image(service).run({ src: "  ", alt: "A" });
    image(service).run();
    expect(service.json).toEqual(hello);
  });

  it("opens on a selected image and replaces its values", () => {
    const { service } = makeEditor();
    service.load(hello);
    service.run((chain) => chain.setTextSelection(6));
    image(service).run({ src: "/a.png", alt: "A" });
    service.run((chain) => chain.setNodeSelection(6));
    const tool = image(service);
    expect(tool.active).toBe(true);
    expect(tool.fields?.().map((f) => f.value)).toEqual(["/a.png", "A"]);
    tool.run({ src: "/b.png", alt: "" });
    const content = service.json.content?.[0]?.content;
    expect(content?.filter((n) => n.type === "image")).toHaveLength(1);
    expect(content?.[1]).toMatchObject({
      type: "image",
      attrs: { src: "/b.png", alt: null },
    });
  });
});

describe("editorGroups", () => {
  it("groups the tools in toolbar order, leaving out an empty group", () => {
    const { service } = makeEditor({ headings: false, history: false });
    const groups = editorGroups(editorTools(service));
    expect(groups.map((g) => g.name)).toEqual([
      "marks",
      "lists",
      "blocks",
      "media",
    ]);
    expect(groups[0]?.tools.map((t) => t.key)).toEqual([
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
      "link",
    ]);
    expect(groups[3]?.tools.map((t) => t.key)).toEqual(["image"]);
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
