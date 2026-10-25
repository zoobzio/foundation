import type { EditorProps } from "../../src/types/components/editor";
import type { Doc } from "@zoobzio/editor";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
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
    expect(host.text()).toBe("Hello worldMore");
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

  it("renders one toolbar button per tool", () => {
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
      "heading-1",
      "heading-2",
      "blockquote",
      "codeBlock",
      "horizontalRule",
      "undo",
      "redo",
    ]);
    expect(wrapper.get(".f-data-editor-toolbar").attributes("role")).toBe(
      "toolbar",
    );
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
