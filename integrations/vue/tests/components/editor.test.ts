import type { EditorProps } from "../../src/types/components/editor";
import type { Doc } from "@zoobzio/editor";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Editor from "../../src/components/editor.vue";
import { makeEditor } from "#test/mount/editor";
import { hello, paragraph } from "#test/data/editor";

const mounted: { unmount: () => void }[] = [];

const mountEditor = (
  props: EditorProps<Doc, Doc>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Editor<Doc, Doc>, {
    props,
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("editor", () => {
  it("shows the document static, with no editor, until the user interacts", () => {
    const { service } = makeEditor();
    service.load(hello);
    const wrapper = mountEditor({ service });
    const host = wrapper.get(".f-data-editor-content");
    expect(host.html()).toContain("<p>Hello world</p>");
    expect(host.attributes("tabindex")).toBe("0");
    expect(host.classes()).not.toContain("ProseMirror");
    expect(service.mounted).toBe(false);
    expect(wrapper.get(".f-data-editor").attributes("data-mounted")).toBe(
      undefined,
    );
    expect(wrapper.emitted("mounted")).toBe(undefined);
  });

  it("the static copy follows load while unmounted", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    expect(wrapper.get(".f-data-editor-content").html()).toContain("<p></p>");
    service.load(hello);
    await nextTick();
    expect(wrapper.get(".f-data-editor-content").text()).toBe("Hello world");
  });

  it("a pointer turns the host itself into the editor, in place", async () => {
    const { service } = makeEditor();
    service.load(hello);
    const wrapper = mountEditor({ service });
    const host = wrapper.get(".f-data-editor-content");
    await host.trigger("pointerdown");
    expect(service.mounted).toBe(true);
    expect(host.classes()).toContain("ProseMirror");
    expect(host.classes()).toContain("f-data-editor-content");
    expect(host.attributes("contenteditable")).toBe("true");
    expect(host.text()).toBe("Hello world");
    expect(wrapper.find(".f-data-editor-content .ProseMirror").exists()).toBe(
      false,
    );
    expect(wrapper.get(".f-data-editor").attributes("data-mounted")).toBe(
      "true",
    );
    expect(wrapper.emitted("mounted")?.at(0)).toEqual([{ id: "test-editor" }]);
  });

  it("keyboard focus turns the editor on once", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    const host = wrapper.get(".f-data-editor-content");
    await host.trigger("focus");
    await host.trigger("pointerdown");
    expect(service.mounted).toBe(true);
    expect(wrapper.emitted("mounted")?.length).toBe(1);
  });

  it("the editor owns the host once on: a later load is not written over", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    const host = wrapper.get(".f-data-editor-content");
    await host.trigger("pointerdown");
    service.load(hello);
    await nextTick();
    expect(host.text()).toBe("Hello world");
    service.insert(paragraph("More"));
    await nextTick();
    expect(host.text()).toBe("MoreHello world");
  });

  it("unmounts the editor with the component", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    await wrapper.get(".f-data-editor-content").trigger("pointerdown");
    wrapper.unmount();
    mounted.pop();
    expect(service.mounted).toBe(false);
    expect(wrapper.emitted("unmounted")?.at(0)).toEqual([
      { id: "test-editor" },
    ]);
  });

  it("renders one toolbar button per tool, the headings as one dropdown", () => {
    const { service } = makeEditor({ headings: [1, 2], lists: false });
    const wrapper = mountEditor({ service });
    const keys = wrapper
      .findAll(".f-data-editor-tool")
      .map((b) => b.attributes("data-tool"));
    expect(keys).toEqual([
      "bold",
      "italic",
      "underline",
      "strike",
      "code",
      "blockquote",
      "codeBlock",
      "horizontalRule",
      "undo",
      "redo",
    ]);
    const block = wrapper.get(".f-data-editor-block");
    expect(block.attributes("aria-haspopup")).toBe("menu");
    expect(block.attributes("data-block")).toBe("paragraph");
    expect(block.text()).toBe("Paragraph");
    expect(wrapper.get(".f-data-editor-toolbar").attributes("role")).toBe(
      "toolbar",
    );
  });

  it("names each button by its label, with the label as its text", () => {
    const { service } = makeEditor({ headings: [2] });
    const wrapper = mountEditor({ service });
    const bold = wrapper.get('[data-tool="bold"]');
    expect(bold.attributes("aria-label")).toBe("Bold");
    expect(bold.text()).toBe("Bold");
    expect(bold.attributes("data-group")).toBe("marks");
  });

  it("groups the tools with a separator between groups", () => {
    const { service } = makeEditor({ headings: [1] });
    const wrapper = mountEditor({ service });
    const children = Array.from(
      wrapper.get(".f-data-editor-toolbar").element.children,
    ).map((el) =>
      el.classList.contains("f-data-editor-separator")
        ? "|"
        : el.classList.contains("f-data-editor-block")
          ? "block"
          : el.getAttribute("data-group"),
    );
    expect(children).toEqual([
      "block",
      "|",
      "marks",
      "marks",
      "marks",
      "marks",
      "marks",
      "|",
      "lists",
      "lists",
      "|",
      "blocks",
      "blocks",
      "blocks",
      "|",
      "history",
      "history",
    ]);
    expect(wrapper.get(".f-data-editor-separator").attributes("role")).toBe(
      "separator",
    );
  });

  it("leaves out an empty group and its separator", () => {
    const { service } = makeEditor({
      headings: false,
      lists: false,
      history: false,
    });
    const wrapper = mountEditor({ service });
    expect(wrapper.findAll(".f-data-editor-separator")).toHaveLength(1);
    expect(
      wrapper
        .findAll(".f-data-editor-tool")
        .map((b) => b.attributes("data-group")),
    ).toEqual([
      "marks",
      "marks",
      "marks",
      "marks",
      "marks",
      "blocks",
      "blocks",
      "blocks",
    ]);
  });

  it("leaves out the dropdown with no headings", () => {
    const { service } = makeEditor({ headings: false });
    const wrapper = mountEditor({ service });
    expect(wrapper.find(".f-data-editor-block").exists()).toBe(false);
    expect(wrapper.findAll(".f-data-editor-separator")).toHaveLength(3);
  });

  it("the dropdown names the block at the selection", async () => {
    const { service } = makeEditor({ headings: [1, 2] });
    const wrapper = mountEditor({ service });
    service.load(hello);
    await nextTick();
    const block = wrapper.get(".f-data-editor-block");
    expect(block.text()).toBe("Paragraph");
    service.block("heading", { level: 2 });
    await nextTick();
    expect(block.text()).toBe("Heading 2");
    expect(block.attributes("data-block")).toBe("heading-2");
  });

  it("picking a block type turns the editor on and applies it", async () => {
    const { service } = makeEditor({ headings: [1, 2] });
    const wrapper = mountEditor({ service });
    service.load(hello);
    await nextTick();
    const open = async () => {
      await wrapper
        .get(".f-data-editor-block")
        .trigger("click", { button: 0, ctrlKey: false });
      await flushPromises();
    };
    const items = () =>
      Array.from(
        document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
      );
    const pick = async (label: string) => {
      await open();
      const item = items().find((el) => el.textContent?.trim() === label);
      if (!item) throw new Error(`no item ${label}`);
      item.click();
      await flushPromises();
    };
    await open();
    expect(items().map((el) => el.textContent?.trim())).toEqual([
      "Paragraph",
      "Heading 1",
      "Heading 2",
    ]);
    expect(items().map((el) => el.hasAttribute("data-current"))).toEqual([
      true,
      false,
      false,
    ]);
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flushPromises();
    await pick("Heading 2");
    expect(service.mounted).toBe(true);
    expect(service.json.content?.[0]).toMatchObject({
      type: "heading",
      attrs: { level: 2 },
    });
    expect(wrapper.get(".f-data-editor-block").text()).toBe("Heading 2");
    await pick("Paragraph");
    expect(service.json.content?.[0]?.type).toBe("paragraph");
    expect(wrapper.get(".f-data-editor-block").text()).toBe("Paragraph");
  });

  it("the dropdown is off where no heading would apply", async () => {
    const { service } = makeEditor({ headings: [1] });
    const wrapper = mountEditor({ service });
    service.load(hello);
    await nextTick();
    const block = wrapper.get(".f-data-editor-block");
    expect(block.attributes("disabled")).toBeUndefined();
    // A code block admits no heading in its place through the block
    // command's dry run once the selection is a node selection on it.
    service.run((chain) =>
      chain
        .setTextSelection({ from: 1, to: 6 })
        .toggleNode("codeBlock", "paragraph"),
    );
    await nextTick();
    const heading = wrapper.vm.ctx.tools.find((t) => t.key === "heading-1");
    expect(block.attributes("disabled")).toBe(
      heading?.disabled ? "" : undefined,
    );
    expect(block.attributes("data-disabled")).toBe(
      heading?.disabled ? "" : undefined,
    );
  });

  it("the block slots fill the dropdown's trigger and items", async () => {
    const { service } = makeEditor({ headings: [1] });
    const wrapper = mountEditor(
      { service },
      {
        blockLabel: '<i class="custom-block">{{ params.block.label }}</i>',
        blockAppend: '<b class="custom-append">v</b>',
        blockItemLabel: '<u class="custom-item">{{ params.item.value }}</u>',
      },
    );
    const block = wrapper.get(".f-data-editor-block");
    expect(block.get("i.custom-block").text()).toBe("Paragraph");
    expect(block.get("b.custom-append").text()).toBe("v");
    await block.trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    expect(
      Array.from(document.querySelectorAll("u.custom-item")).map(
        (el) => el.textContent,
      ),
    ).toEqual(["paragraph", "heading-1"]);
  });

  it("the block slot replaces the dropdown", () => {
    const { service } = makeEditor({ headings: [1] });
    const wrapper = mountEditor(
      { service },
      { block: '<output class="custom">{{ params.blocks.length }}</output>' },
    );
    expect(wrapper.find(".f-data-editor-block").exists()).toBe(false);
    expect(wrapper.get("output.custom").text()).toBe("2");
  });

  it("a toggle reports aria-pressed; an action never does", () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    expect(wrapper.get('[data-tool="bold"]').attributes("aria-pressed")).toBe(
      "false",
    );
    expect(
      wrapper.get('[data-tool="undo"]').attributes("aria-pressed"),
    ).toBeUndefined();
    expect(
      wrapper.get('[data-tool="horizontalRule"]').attributes("aria-pressed"),
    ).toBeUndefined();
  });

  it("disables a tool whose command would not apply", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    service.load(hello);
    await nextTick();
    const undo = wrapper.get('[data-tool="undo"]');
    const redo = wrapper.get('[data-tool="redo"]');
    const bold = wrapper.get('[data-tool="bold"]');
    expect(undo.attributes("disabled")).toBeDefined();
    expect(undo.attributes("data-disabled")).toBeDefined();
    expect(bold.attributes("disabled")).toBeUndefined();
    service.insert(paragraph("More"));
    await nextTick();
    expect(undo.attributes("disabled")).toBeUndefined();
    expect(undo.attributes("data-disabled")).toBeUndefined();
    expect(redo.attributes("disabled")).toBeDefined();
    // The inserted paragraph sits at the start: select its text.
    service.run((chain) => chain.setTextSelection({ from: 1, to: 5 }));
    service.block("codeBlock");
    await nextTick();
    expect(bold.attributes("disabled")).toBeDefined();
    expect(
      wrapper.get('[data-tool="codeBlock"]').attributes("aria-pressed"),
    ).toBe("true");
  });

  it("the toolbar is one tab stop with arrow-key focus between the tools", async () => {
    const { service } = makeEditor({ headings: false, history: false });
    // Without headings the first stop is a tool; with them it is the dropdown.
    const wrapper = mountEditor({ service });
    // The root takes the tab stop once its items have registered.
    await nextTick();
    const toolbar = wrapper.get(".f-data-editor-toolbar");
    const tools = wrapper.findAll(".f-data-editor-tool");
    expect(toolbar.attributes("tabindex")).toBe("0");
    expect(tools.every((b) => b.attributes("tabindex") === "-1")).toBe(true);
    (toolbar.element as HTMLElement).focus();
    await flushPromises();
    expect(document.activeElement).toBe(tools[0]!.element);
    expect(tools[0]!.attributes("tabindex")).toBe("0");
    await tools[0]!.trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    expect(document.activeElement).toBe(tools[1]!.element);
    await tools[1]!.trigger("keydown", { key: "End" });
    await flushPromises();
    expect(document.activeElement).toBe(tools.at(-1)!.element);
  });

  it("the dropdown's trigger is in the toolbar's focus order", async () => {
    const { service } = makeEditor({ headings: [1], history: false });
    const wrapper = mountEditor({ service });
    await nextTick();
    const toolbar = wrapper.get(".f-data-editor-toolbar");
    const block = wrapper.get(".f-data-editor-block");
    expect(block.attributes("tabindex")).toBe("-1");
    (toolbar.element as HTMLElement).focus();
    await flushPromises();
    expect(document.activeElement).toBe(block.element);
    await block.trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    expect(document.activeElement).toBe(
      wrapper.get('[data-tool="bold"]').element,
    );
  });

  it("a press keeps focus in the document", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    wrapper.get('[data-tool="bold"]').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("marks an empty document", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    expect(wrapper.get(".f-data-editor").attributes("data-empty")).toBe("true");
    service.load(hello);
    await nextTick();
    expect(wrapper.get(".f-data-editor").attributes("data-empty")).toBe(
      undefined,
    );
  });

  it("a tool click turns the editor on, runs its command, and the button follows the selection", async () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    service.load(hello);
    service.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
    const bold = wrapper.get('[data-tool="bold"]');
    expect(bold.attributes("aria-pressed")).toBe("false");
    await bold.trigger("click");
    expect(service.mounted).toBe(true);
    expect(service.active.bold).toBe(true);
    expect(bold.attributes("aria-pressed")).toBe("true");
    expect(wrapper.get(".f-data-editor-content strong").text()).toBe("Hello");
  });

  it("relays the service's events as emits", () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    service.load(hello);
    expect(wrapper.emitted("loaded")?.at(0)).toEqual([
      { id: "test-editor", revision: 1 },
    ]);
    service.insert(paragraph("More"));
    expect(wrapper.emitted("updated")?.at(0)).toEqual([
      { id: "test-editor", revision: 2 },
    ]);
  });

  it("exposes the context", () => {
    const { service } = makeEditor();
    const wrapper = mountEditor({ service });
    const ctx = (
      wrapper.vm as unknown as {
        ctx: { id: string; tools: unknown[]; activate: () => void };
      }
    ).ctx;
    expect(ctx.id).toBe("editor");
    expect(ctx.tools.length).toBeGreaterThan(0);
    ctx.activate();
    expect(service.mounted).toBe(true);
  });

  it("passthrough reaches the toolbar, each tool, and the content host", () => {
    const { service } = makeEditor({ history: false });
    const wrapper = mountEditor({
      service,
      pt: {
        toolbar: { id: "tb" },
        tool: (tool) => ({ title: tool.label }),
        content: { id: "host" },
      },
    });
    expect(wrapper.get(".f-data-editor-toolbar").attributes("id")).toBe("tb");
    expect(wrapper.get('[data-tool="bold"]').attributes("title")).toBe("Bold");
    expect(wrapper.get('[data-tool="bold"]').classes()).toContain("f-button");
    expect(wrapper.get('[data-tool="bold"]').attributes("type")).toBe("button");
    expect(wrapper.get(".f-data-editor-content").attributes("id")).toBe("host");
  });

  it("the toolbar slot replaces the toolbar", () => {
    const { service } = makeEditor();
    const wrapper = mountEditor(
      { service },
      { toolbar: '<nav class="custom">{{ params.tools.length }}</nav>' },
    );
    expect(wrapper.find(".f-data-editor-toolbar").exists()).toBe(false);
    expect(wrapper.get("nav.custom").text()).not.toBe("");
  });

  it("the toolLabel slot replaces each button's label", () => {
    const { service } = makeEditor({ history: false });
    const wrapper = mountEditor(
      { service },
      { toolLabel: '<i class="custom-label">{{ params.tool.key }}</i>' },
    );
    const bold = wrapper.get('.f-data-editor-tool[data-tool="bold"]');
    expect(bold.get("i.custom-label").text()).toBe("bold");
    expect(bold.text()).toBe("bold");
  });

  it("the tool slot replaces each button", () => {
    const { service } = makeEditor({ history: false });
    const wrapper = mountEditor(
      { service },
      { tool: '<i class="custom-tool">{{ params.tool.key }}</i>' },
    );
    expect(wrapper.find(".f-data-editor-tool").exists()).toBe(false);
    expect(wrapper.get("i.custom-tool").text()).toBe("bold");
  });
});
