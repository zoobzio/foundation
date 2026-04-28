import { describe, it, expect } from "vitest";
import { mountMarkdown } from "../fixtures";

const normalize = (html: string) => html.replace(/\s+/g, " ").trim();

describe("Markdown", () => {
  describe("static", () => {
    const wrapper = mountMarkdown();

    it("renders root with f-markdown class", () => {
      expect(wrapper.find(".f-markdown").exists()).toBe(true);
    });

    it("renders root as article element", () => {
      expect(wrapper.find("article").exists()).toBe(true);
    });
  });

  describe("markdown to html", () => {
    it("renders a paragraph", () => {
      const wrapper = mountMarkdown({ content: "Hello world" });
      expect(normalize(wrapper.find(".f-markdown").html())).toContain(
        '<p class="f-markdown-p">Hello world</p>',
      );
    });

    it("renders inline formatting", () => {
      const wrapper = mountMarkdown({ content: "**bold** *italic* ~~struck~~" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<strong class="f-markdown-strong">bold</strong>');
      expect(html).toContain('<em class="f-markdown-em">italic</em>');
      expect(html).toContain('<del class="f-markdown-del">struck</del>');
    });

    it("renders headings at correct depth", () => {
      const wrapper = mountMarkdown({ content: "# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5\n\n###### H6" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<h1 class="f-markdown-h1">H1</h1>');
      expect(html).toContain('<h2 class="f-markdown-h2">H2</h2>');
      expect(html).toContain('<h3 class="f-markdown-h3">H3</h3>');
      expect(html).toContain('<h4 class="f-markdown-h4">H4</h4>');
      expect(html).toContain('<h5 class="f-markdown-h5">H5</h5>');
      expect(html).toContain('<h6 class="f-markdown-h6">H6</h6>');
    });

    it("renders unordered list", () => {
      const wrapper = mountMarkdown({ content: "- alpha\n- bravo" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<ul class="f-markdown-ul">');
      expect(html).toContain('<li class="f-markdown-li">');
      expect(html).toContain("alpha");
      expect(html).toContain("bravo");
    });

    it("renders ordered list", () => {
      const wrapper = mountMarkdown({ content: "1. first\n2. second" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<ol class="f-markdown-ol">');
      expect(html).toContain('<li class="f-markdown-li">');
    });

    it("renders blockquote", () => {
      const wrapper = mountMarkdown({ content: "> quoted" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<blockquote class="f-markdown-blockquote">');
      expect(html).toContain("quoted");
    });

    it("renders inline code", () => {
      const wrapper = mountMarkdown({ content: "Use `foo` here" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<code class="f-markdown-code">foo</code>');
    });

    it("renders fenced code block as pre > code with language", () => {
      const wrapper = mountMarkdown({ content: "```ts\nconst x = 1;\n```" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<pre class="f-markdown-pre" data-language="ts">');
      expect(html).toContain('<code class="f-markdown-code">const x = 1;</code>');
    });

    it("renders link with href and text", () => {
      const wrapper = mountMarkdown({ content: "[click me](https://example.com)" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<a class="f-markdown-a" to="https://example.com">click me</a>');
    });

    it("renders image with src and alt", () => {
      const wrapper = mountMarkdown({ content: "![photo](https://example.com/img.png)" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<img class="f-markdown-img" src="https://example.com/img.png" alt="photo">');
    });

    it("renders horizontal rule", () => {
      const wrapper = mountMarkdown({ content: "above\n\n---\n\nbelow" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<hr class="f-markdown-hr">');
    });

    it("renders GFM table with thead and tbody", () => {
      const wrapper = mountMarkdown({ content: "| Name | Age |\n| --- | --- |\n| Alice | 30 |" });
      const html = normalize(wrapper.find(".f-markdown").html());
      expect(html).toContain('<table class="f-markdown-table">');
      expect(html).toContain('<thead class="f-markdown-thead">');
      expect(html).toContain('<tbody class="f-markdown-tbody">');
      expect(html).toContain("Name");
      expect(html).toContain("Alice");
    });

    it("renders a full document", () => {
      const md = [
        "# Title",
        "",
        "A paragraph with **bold** and *italic* text.",
        "",
        "- item one",
        "- item two",
        "",
        "> A quote",
        "",
        "```js",
        "console.log('hi');",
        "```",
      ].join("\n");

      const wrapper = mountMarkdown({ content: md });
      const html = normalize(wrapper.find(".f-markdown").html());

      expect(html).toContain('<h1 class="f-markdown-h1">Title</h1>');
      expect(html).toContain('<strong class="f-markdown-strong">bold</strong>');
      expect(html).toContain('<em class="f-markdown-em">italic</em>');
      expect(html).toContain('<ul class="f-markdown-ul">');
      expect(html).toContain('<blockquote class="f-markdown-blockquote">');
      expect(html).toContain('<pre class="f-markdown-pre" data-language="js">');
      expect(html).toContain("console.log('hi');");
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root article", () => {
      const wrapper = mountMarkdown({
        pt: { root: { props: { class: "custom" } } },
      });
      expect(wrapper.find(".f-markdown").classes()).toContain("custom");
    });
  });
});
