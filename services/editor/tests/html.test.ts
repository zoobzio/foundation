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

  it("round-trips an image where it sits, inside its paragraph", () => {
    const ctx = context();
    const source =
      '<p>See <img src="/a.png" alt="A" title="T"> here.</p><p><img src="/b.png"></p>';
    const read = html.read(source, ctx);
    expect(read.content?.[0]?.content?.[1]).toEqual({
      type: "image",
      attrs: { src: "/a.png", alt: "A", title: "T", width: null, height: null },
    });
    expect(html.write(read, ctx)).toBe(source);
  });

  it("round-trips a link", () => {
    const ctx = context();
    const read = html.read('<p><a href="https://example.com">x</a></p>', ctx);
    expect(read.content?.[0]?.content?.[0]?.marks?.[0]).toMatchObject({
      type: "link",
      attrs: { href: "https://example.com" },
    });
    expect(html.write(read, ctx)).toContain('href="https://example.com"');
  });

  it("an element the schema does not model keeps its text and loses itself", () => {
    const read = html.read("<div data-x><p>kept</p></div>", context());
    expect(read.content).toEqual([
      { type: "paragraph", content: [{ type: "text", text: "kept" }] },
    ]);
  });
});
