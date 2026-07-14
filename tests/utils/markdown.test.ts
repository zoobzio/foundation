import { describe, it, expect } from "vitest";
import { parseMarkdown } from "#foundation/utils/markdown";

describe("parseMarkdown", () => {
  it("returns a root node", () => {
    const tree = parseMarkdown("hello");
    expect(tree.type).toBe("root");
  });

  it("parses paragraph", () => {
    const tree = parseMarkdown("hello");
    expect(tree.children[0].type).toBe("paragraph");
  });

  it("parses heading", () => {
    const tree = parseMarkdown("# Title");
    const heading = tree.children[0];
    expect(heading.type).toBe("heading");
    if (heading.type === "heading") {
      expect(heading.depth).toBe(1);
    }
  });

  it("parses GFM strikethrough", () => {
    const tree = parseMarkdown("~~deleted~~");
    const p = tree.children[0];
    if (p.type === "paragraph") {
      expect(p.children[0].type).toBe("delete");
    }
  });

  it("parses GFM table", () => {
    const tree = parseMarkdown("| A | B |\n| --- | --- |\n| 1 | 2 |");
    expect(tree.children[0].type).toBe("table");
  });

  it("parses code block with language", () => {
    const tree = parseMarkdown("```js\nconst x = 1;\n```");
    const code = tree.children[0];
    expect(code.type).toBe("code");
    if (code.type === "code") {
      expect(code.lang).toBe("js");
      expect(code.value).toBe("const x = 1;");
    }
  });
});
