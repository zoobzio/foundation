// The editor wrapper: an icon toolbar. Each tool draws its icon in place
// of its label; the label, in the visitor's locale, names the button and
// is its tooltip. The block type dropdown reads in the visitor's locale
// with the `expand` icon after its text.
import type { Doc } from "@zoobzio/editor";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Editor from "../../../app/components/editor";
import { makeEditor } from "#test/mount/editor";
import { hello } from "#test/data/editor";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("editor wrapper", () => {
  it("draws each tool as its icon, named by its label", () => {
    const { service } = makeEditor();
    service.load(hello);
    const wrapper = mount(Editor<Doc, Doc>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const tool = (key: string) => wrapper.get(`button[data-tool="${key}"]`);
    const icon = (key: string) =>
      tool(key).get("svg[data-icon]").attributes("data-icon");
    expect(icon("bold")).toBe("bold");
    expect(icon("bulletList")).toBe("bullet-list");
    expect(icon("undo")).toBe("undo");
    expect(tool("bold").text()).toBe("");
    expect(tool("bold").attributes("aria-label")).toBe("Bold");
    expect(tool("bold").attributes("title")).toBe("Bold");
    expect(tool("horizontalRule").attributes("aria-label")).toBe("Rule");
  });

  it("reads the block type dropdown from the contract, with the expand icon", async () => {
    const { service } = makeEditor({ headings: [1, 2] });
    service.load(hello);
    const wrapper = mount(Editor<Doc, Doc>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const block = wrapper.get(".f-data-editor-block");
    expect(block.get("span.f-span").text()).toBe("Paragraph");
    expect(block.get("svg[data-icon]").attributes("data-icon")).toBe("expand");
    service.block("heading", { level: 2 });
    await nextTick();
    expect(block.get("span.f-span").text()).toBe("Heading 2");
    await block.trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    expect(
      Array.from(document.querySelectorAll('[role="menuitem"]')).map((el) =>
        el.textContent?.trim(),
      ),
    ).toEqual(["Paragraph", "Heading 1", "Heading 2"]);
  });

  it("keeps the toolbar's groups and the tools' states", () => {
    const { service } = makeEditor({ headings: [1, 2] });
    service.load(hello);
    const wrapper = mount(Editor<Doc, Doc>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.findAll(".f-data-editor-separator")).toHaveLength(4);
    expect(
      wrapper.get('button[data-tool="bold"]').attributes("aria-pressed"),
    ).toBe("false");
    expect(
      wrapper.get('button[data-tool="undo"]').attributes("disabled"),
    ).toBeDefined();
    expect(wrapper.get(".f-data-editor-toolbar").attributes("role")).toBe(
      "toolbar",
    );
  });

  it("composes a consumer's pt.tool over the layer's label", () => {
    const { service } = makeEditor();
    const wrapper = mount(Editor<Doc, Doc>, {
      props: {
        service,
        pt: { tool: (tool) => ({ "data-custom": tool.key }) },
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const bold = wrapper.get('button[data-tool="bold"]');
    expect(bold.attributes("data-custom")).toBe("bold");
    expect(bold.attributes("aria-label")).toBe("Bold");
    expect(bold.get("svg[data-icon]").attributes("data-icon")).toBe("bold");
  });
});
