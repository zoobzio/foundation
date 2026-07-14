import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mountCodeView } from "#test/support/fixtures/components";

describe("CodeView", () => {
  describe("static", () => {
    const wrapper = mountCodeView();

    it("renders root with f-code-view class", () => {
      expect(wrapper.find(".f-code-view").exists()).toBe(true);
    });

    it("renders editor container with f-code-view-editor class", () => {
      expect(wrapper.find(".f-code-view-editor").exists()).toBe(true);
    });

    it("renders CodeMirror into editor container", () => {
      expect(wrapper.find(".cm-editor").exists()).toBe(true);
    });

    it("editor is read-only", () => {
      const content = wrapper.find(".cm-content");
      expect(content.attributes("contenteditable")).toBe("false");
    });
  });

  describe("code to view", () => {
    it("renders JSON content", async () => {
      const wrapper = mountCodeView({
        content: '{"name": "foundation", "version": "1.0.0"}',
        language: "json",
      });
      await nextTick();
      expect(wrapper.text()).toContain('"name"');
      expect(wrapper.text()).toContain('"foundation"');
      expect(wrapper.text()).toContain('"version"');
      expect(wrapper.text()).toContain('"1.0.0"');
    });

    it("renders JavaScript content", async () => {
      const wrapper = mountCodeView({
        content: "const greeting = \"hello\";\nconsole.log(greeting);",
        language: "js",
      });
      await nextTick();
      expect(wrapper.text()).toContain("const");
      expect(wrapper.text()).toContain("greeting");
      expect(wrapper.text()).toContain("console");
    });

    it("renders TypeScript content", async () => {
      const wrapper = mountCodeView({
        content: "interface User {\n  name: string;\n  age: number;\n}",
        language: "ts",
      });
      await nextTick();
      expect(wrapper.text()).toContain("interface");
      expect(wrapper.text()).toContain("User");
      expect(wrapper.text()).toContain("name");
      expect(wrapper.text()).toContain("string");
    });

    it("renders multiline content preserving all lines", async () => {
      const lines = ["line one", "line two", "line three"];
      const wrapper = mountCodeView({ content: lines.join("\n") });
      await nextTick();
      for (const line of lines) {
        expect(wrapper.text()).toContain(line);
      }
    });

    it("renders content without a language", async () => {
      const wrapper = mountCodeView({ content: "plain text content" });
      await nextTick();
      expect(wrapper.text()).toContain("plain text content");
    });

    it("renders empty content", async () => {
      const wrapper = mountCodeView({ content: "" });
      await nextTick();
      expect(wrapper.find(".cm-editor").exists()).toBe(true);
    });

    it("renders a full JSON document", async () => {
      const json = JSON.stringify(
        { users: [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }] },
        null,
        2,
      );
      const wrapper = mountCodeView({ content: json, language: "json" });
      await nextTick();
      expect(wrapper.text()).toContain("Alice");
      expect(wrapper.text()).toContain("Bob");
      expect(wrapper.text()).toContain("users");
    });
  });

  describe("search", () => {
    it("exposes setQuery, nextMatch, prevMatch", () => {
      const wrapper = mountCodeView({ content: "hello world" });
      expect(wrapper.vm.setQuery).toBeTypeOf("function");
      expect(wrapper.vm.nextMatch).toBeTypeOf("function");
      expect(wrapper.vm.prevMatch).toBeTypeOf("function");
    });

    it("setQuery can be called without error", () => {
      const wrapper = mountCodeView({ content: "hello world" });
      expect(() => wrapper.vm.setQuery("hello")).not.toThrow();
    });

    it("nextMatch and prevMatch can be called without error", () => {
      const wrapper = mountCodeView({ content: "hello world" });
      expect(() => wrapper.vm.nextMatch()).not.toThrow();
      expect(() => wrapper.vm.prevMatch()).not.toThrow();
    });
  });

  describe("lifecycle", () => {
    it("cleans up editor on unmount without error", async () => {
      const wrapper = mountCodeView({ content: "test" });
      await nextTick();
      expect(wrapper.find(".cm-editor").exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe("passthrough", () => {
    it("pt.root merges onto root", () => {
      const wrapper = mountCodeView({
        pt: { root: { props: { class: "custom-root" } } },
      });
      expect(wrapper.find(".f-code-view").classes()).toContain("custom-root");
    });

    it("pt.editor merges onto editor container", () => {
      const wrapper = mountCodeView({
        pt: { editor: { props: { class: "custom-editor" } } },
      });
      expect(wrapper.find(".f-code-view-editor").classes()).toContain("custom-editor");
    });
  });
});
