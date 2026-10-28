import type { RichTextContext } from "../../src/types/components/rich-text";
import type { RichTextProps } from "../../src/types/components/rich-text";
import type { Context } from "../../src/types/context";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import RichText from "../../src/components/rich-text.vue";
import { paragraph } from "#test/data/editor";

const mounted: { unmount: () => void }[] = [];

const mountRichText = (
  props: RichTextProps = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(RichText, { props, slots, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

/** The forwarded editor context, with the service the component owns. */
const ctxOf = (wrapper: ReturnType<typeof mountRichText>) =>
  (wrapper.vm as unknown as { ctx: Context<RichTextContext> }).ctx;

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("rich-text", () => {
  it("renders the model as the static document", () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello <b>you</b></p>" });
    const host = wrapper.get(".f-data-editor-content");
    expect(host.html()).toContain("<p>Hello <strong>you</strong></p>");
    expect(ctxOf(wrapper).editor.mounted).toBe(false);
    expect(wrapper.get(".f-data-editor").attributes("data-empty")).toBe(
      undefined,
    );
  });

  it("starts empty with no model", () => {
    const wrapper = mountRichText();
    expect(wrapper.get(".f-data-editor").attributes("data-empty")).toBe("true");
    expect(wrapper.get(".f-data-editor-content").html()).toContain("<p></p>");
  });

  it("an edit models the document as HTML", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    ctxOf(wrapper).editor.insert(paragraph("More"));
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toEqual([
      ["<p>Hello</p><p>More</p>"],
    ]);
  });

  it("an empty document models as an empty string", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    ctxOf(wrapper).editor.run((chain) => chain.clearContent(true));
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([""]);
  });

  it("a model write from outside replaces the document", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    await wrapper.setProps({ modelValue: "<h1>Reset</h1>" });
    expect(wrapper.get(".f-data-editor-content").html()).toContain(
      "<h1>Reset</h1>",
    );
    expect(wrapper.emitted("update:modelValue")).toBe(undefined);
  });

  it("the model's own echo is not loaded back", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    const { editor } = ctxOf(wrapper);
    editor.insert(paragraph("More"));
    await nextTick();
    const revision = editor.revision;
    const [html] = wrapper.emitted("update:modelValue")!.at(-1) as [string];
    await wrapper.setProps({ modelValue: html });
    expect(editor.revision).toBe(revision);
  });

  it("a controlled model that follows the edit keeps the editor's document", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    const { editor } = ctxOf(wrapper);
    await wrapper.get(".f-data-editor-content").trigger("pointerdown");
    editor.insert(paragraph("More"));
    await nextTick();
    const [html] = wrapper.emitted("update:modelValue")!.at(-1) as [string];
    await wrapper.setProps({ modelValue: html });
    expect(wrapper.get(".f-data-editor-content").text()).toBe("HelloMore");
    expect(editor.undo()).toBe(true);
  });

  it("relays the host's blur", async () => {
    const wrapper = mountRichText();
    await wrapper.get(".f-data-editor-content").trigger("blur");
    expect(wrapper.emitted("blur")).toHaveLength(1);
  });

  it("narrows the toolbar to the features", () => {
    const wrapper = mountRichText({
      features: { headings: [2], lists: false, history: false },
    });
    const tools = wrapper
      .findAll(".f-data-editor-tool")
      .map((b) => b.attributes("data-tool"));
    expect(tools).toContain("heading-2");
    expect(tools).not.toContain("heading-1");
    expect(tools).not.toContain("bulletList");
    expect(tools).not.toContain("undo");
  });

  it("names the editor service by id", () => {
    const named = mountRichText({ id: "body" });
    expect(ctxOf(named).editor.id).toBe("body");
    const anonymous = mountRichText();
    expect(ctxOf(anonymous).editor.id).not.toBe("");
  });

  it("carries required onto the host", () => {
    const wrapper = mountRichText({ required: true });
    expect(
      wrapper.get(".f-data-editor-content").attributes("aria-required"),
    ).toBe("true");
  });

  it("disabled never activates and turns the tools off", async () => {
    const wrapper = mountRichText({
      modelValue: "<p>Hello</p>",
      disabled: true,
    });
    const host = wrapper.get(".f-data-editor-content");
    expect(host.attributes("aria-disabled")).toBe("true");
    expect(host.attributes("tabindex")).toBe("-1");
    await host.trigger("pointerdown");
    await host.trigger("focus");
    expect(ctxOf(wrapper).editor.mounted).toBe(false);
    expect(host.attributes("contenteditable")).toBeUndefined();
    const tools = wrapper.findAll(".f-data-editor-tool");
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.every((b) => b.attributes("disabled") !== undefined)).toBe(
      true,
    );
  });

  it("passthrough reaches the editor through the layer", () => {
    const wrapper = mountRichText({
      required: true,
      pt: { content: { id: "host" }, toolbar: { id: "tb" } },
    });
    const host = wrapper.get(".f-data-editor-content");
    expect(host.attributes("id")).toBe("host");
    expect(host.attributes("aria-required")).toBe("true");
    expect(wrapper.get(".f-data-editor-toolbar").attributes("id")).toBe("tb");
  });

  it("relays the editor's slots", () => {
    const wrapper = mountRichText(
      {},
      {
        tool: `<template #tool="{ tool }">
          <output>{{ tool.key }}</output>
        </template>`,
      },
    );
    expect(wrapper.findAll("output").map((o) => o.text())).toContain("bold");
  });

  it("destroys the editor with the component", async () => {
    const wrapper = mountRichText({ modelValue: "<p>Hello</p>" });
    const { editor } = ctxOf(wrapper);
    await wrapper.get(".f-data-editor-content").trigger("pointerdown");
    expect(editor.mounted).toBe(true);
    wrapper.unmount();
    mounted.pop();
    expect(editor.mounted).toBe(false);
  });
});
