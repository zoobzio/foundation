import { describe, expect, it } from "vitest";
import { html } from "../src/html";
import { context, document } from "./codec";

describe("html", () => {
  it("writes the document as HTML by the extensions' rules", () => {
    const out = html.write(document, context());
    expect(out).toBe(
      "<h2>Title</h2><p>A <strong>bold</strong> word and <code>code</code>.</p><ul><li><p>one</p></li><li><p>two</p></li></ul>",
    );
  });

  it("reads HTML as the document by the extensions' rules", () => {
    expect(html.read("<p>Hi <em>there</em></p>", context())).toEqual({
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

  it("round-trips", () => {
    const ctx = context();
    expect(html.read(html.write(document, ctx), ctx)).toEqual(document);
  });

  it("an element the schema does not model keeps its text and loses itself", () => {
    const read = html.read("<div data-x><p>kept</p></div>", context());
    expect(read.content).toEqual([
      { type: "paragraph", content: [{ type: "text", text: "kept" }] },
    ]);
  });
});
