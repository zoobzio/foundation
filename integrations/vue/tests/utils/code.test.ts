import { describe, expect, it } from "vitest";
import { codeMarkup, escape } from "../../src/utils/code";

describe("escape", () => {
  it("escapes the markup characters and nothing else", () => {
    expect(escape('a < b && c > "d"')).toBe('a &lt; b &amp;&amp; c &gt; "d"');
  });
});

describe("codeMarkup", () => {
  it("wraps the text escaped in a static pre", () => {
    expect(codeMarkup("<p>")).toBe(
      '<pre class="f-data-code-static">&lt;p&gt;</pre>',
    );
  });

  it("doubles a leading newline, since a browser's parser drops one", () => {
    expect(codeMarkup("\nsecond")).toBe(
      '<pre class="f-data-code-static">\n\nsecond</pre>',
    );
    expect(codeMarkup("a\nb")).toBe(
      '<pre class="f-data-code-static">a\nb</pre>',
    );
  });

  it("reads back as the text", () => {
    const host = document.createElement("div");
    host.innerHTML = codeMarkup("a\n  <b> & c\n");
    expect(host.textContent).toBe("a\n  <b> & c\n");
  });
});
