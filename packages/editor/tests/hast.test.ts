import type { Root } from "hast";

import { describe, expect, it } from "vitest";
import { hast } from "../src/hast";
import { context, document } from "./codec";

const tree: Root = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "p",
      properties: {},
      children: [
        { type: "text", value: "Hi " },
        {
          type: "element",
          tagName: "em",
          properties: {},
          children: [{ type: "text", value: "there" }],
        },
      ],
    },
  ],
};

const positions = (node: unknown): boolean => {
  if (typeof node !== "object" || node === null) return false;
  if ("position" in node) return true;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.some(positions);
  }
  return false;
};

describe("hast", () => {
  it("reads a tree as the document", () => {
    expect(hast.read(tree, context())).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Hi " },
            { type: "text", text: "there", marks: [{ type: "italic" }] },
          ],
        },
      ],
    });
  });

  it("writes the document as a tree with no positions", () => {
    const out = hast.write(document, context());
    expect(out.type).toBe("root");
    expect(
      out.children.map((c) => (c.type === "element" ? c.tagName : c.type)),
    ).toEqual(["h2", "p", "ul"]);
    expect(positions(out)).toBe(false);
  });

  it("round-trips through the document", () => {
    const ctx = context();
    expect(hast.read(hast.write(document, ctx), ctx)).toEqual(document);
  });

  it("round-trips through the tree", () => {
    const ctx = context();
    expect(hast.write(hast.read(tree, ctx), ctx)).toEqual(tree);
  });
});
