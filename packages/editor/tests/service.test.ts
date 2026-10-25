// Constructor-injected seams — a plain state container, vi.fn() reader and
// writer, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (seam calls,
// events).
import { describe, expect, it, vi } from "vitest";
import { Node } from "@tiptap/core";
import { EditorService } from "../src/service";
import { createEditorState } from "../src/state";
import type { Actions, Change, Config, Options, State } from "../src/types";
import type { JSONContent } from "@tiptap/core";
import { doc, fakeConfig, hello, paragraph, passthrough } from "./data";

const makeService = (
  overrides: {
    state?: State;
    actions?: Partial<Actions<JSONContent, JSONContent>>;
    config?: Config;
    options?: Options;
  } = {},
) => {
  const config = overrides.config ?? fakeConfig;
  const state = overrides.state ?? createEditorState();
  const read = vi.fn(passthrough.read);
  const write = vi.fn(passthrough.write);
  const actions: Actions<JSONContent, JSONContent> = {
    read,
    write,
    ...overrides.actions,
  };
  const service = new EditorService<JSONContent, JSONContent>(
    "test-editor",
    config,
    state,
    actions,
    overrides.options,
  );
  const loaded = vi.fn();
  const updated = vi.fn();
  const mounted = vi.fn();
  const unmounted = vi.fn();
  const change = vi.fn<(change: Change) => void>();
  service.on("loaded", loaded);
  service.on("updated", updated);
  service.on("mounted", mounted);
  service.on("unmounted", unmounted);
  service.on("change", change);
  return {
    service,
    state,
    read,
    write,
    loaded,
    updated,
    mounted,
    unmounted,
    change,
  };
};

/** Selects a range of the first paragraph, so a mark has text to land on. */
const select = (
  service: EditorService<JSONContent, JSONContent>,
  from: number,
  to: number,
) => service.run((chain) => chain.setTextSelection({ from, to }));

describe("config", () => {
  it("exposes the id and a frozen config", () => {
    const { service } = makeService({ config: { lists: false } });
    expect(service.id).toBe("test-editor");
    expect(service.config).toEqual({ lists: false });
    expect(Object.isFrozen(service.config)).toBe(true);
  });

  it("exposes the schema and extensions as the context", () => {
    const { service } = makeService();
    expect(service.context.schema.nodes.paragraph).toBeDefined();
    expect(service.context.extensions.length).toBeGreaterThan(0);
  });

  it("the feature set shapes the schema", () => {
    const { service } = makeService({
      config: { lists: false, code: false, headings: [1, 2] },
    });
    const { nodes, marks } = service.context.schema;
    expect(nodes.bulletList).toBeUndefined();
    expect(nodes.orderedList).toBeUndefined();
    expect(nodes.codeBlock).toBeUndefined();
    expect(marks.code).toBeUndefined();
    expect(nodes.heading).toBeDefined();
    expect(nodes.paragraph).toBeDefined();
  });

  it("the consumer's extensions join the schema", () => {
    const Callout = Node.create({
      name: "callout",
      group: "block",
      content: "block+",
      parseHTML: () => [{ tag: "div[data-callout]" }],
      renderHTML: () => ["div", { "data-callout": "" }, 0],
    });
    const { service } = makeService({ actions: { extensions: [Callout] } });
    expect(service.context.schema.nodes.callout).toBeDefined();
  });

  it("starts empty at revision zero", () => {
    const { service } = makeService();
    expect(service.revision).toBe(0);
    expect(service.empty).toBe(true);
    expect(service.mounted).toBe(false);
    expect(service.json).toEqual(doc({ type: "paragraph" }));
  });
});

describe("load", () => {
  it("reads the source through the reader with the context", () => {
    const { service, read } = makeService();
    service.load(hello);
    expect(read).toHaveBeenCalledWith(hello, service.context);
    expect(service.json).toEqual(hello);
  });

  it("bumps the revision, clears empty, and emits loaded, not updated", () => {
    const { service, loaded, updated } = makeService();
    service.load(hello);
    expect(service.revision).toBe(1);
    expect(service.empty).toBe(false);
    expect(loaded).toHaveBeenCalledWith({ id: "test-editor", revision: 1 });
    expect(updated).not.toHaveBeenCalled();
  });

  it("refreshes the active snapshot", () => {
    const { service } = makeService();
    service.load(doc({ type: "heading", attrs: { level: 2 }, content: [] }));
    expect(service.active.heading).toBe(true);
    expect(service.active.paragraph).toBe(false);
  });

  it("replaces the document", () => {
    const { service } = makeService();
    service.load(hello);
    service.load(doc(paragraph("Second")));
    expect(service.json).toEqual(doc(paragraph("Second")));
    expect(service.revision).toBe(2);
  });

  it("starts the history over", () => {
    const { service } = makeService();
    service.load(hello);
    service.insert(paragraph("Edit"));
    service.load(doc(paragraph("Second")));
    expect(service.undo()).toBe(false);
    expect(service.json).toEqual(doc(paragraph("Second")));
  });
});

describe("document", () => {
  it("writes through the writer on read, with the context", () => {
    const { service, write } = makeService();
    service.load(hello);
    expect(write).not.toHaveBeenCalled();
    expect(service.document).toEqual(hello);
    expect(write).toHaveBeenCalledWith(hello, service.context);
  });

  it("writes on every read; caching is the caller's", () => {
    const { service, write } = makeService();
    expect(service.document).toEqual(service.json);
    expect(service.document).toEqual(service.json);
    expect(write).toHaveBeenCalledTimes(2);
  });

  it("carries the writer's form", () => {
    const state = createEditorState();
    const service = new EditorService<JSONContent, string>(
      "text",
      fakeConfig,
      state,
      {
        read: passthrough.read,
        write: (document) => JSON.stringify(document),
      },
    );
    service.load(hello);
    expect(service.document).toBe(JSON.stringify(hello));
  });
});

describe("updated", () => {
  it("an edit bumps the revision and emits updated", () => {
    const { service, updated, change } = makeService();
    service.insert(paragraph("Typed"));
    expect(service.revision).toBe(1);
    expect(service.empty).toBe(false);
    expect(updated).toHaveBeenCalledWith({ id: "test-editor", revision: 1 });
    const revisions = change.mock.calls
      .map(([c]) => c)
      .filter((c) => c.field === "revision");
    expect(revisions).toEqual([{ field: "revision", before: 0, after: 1 }]);
  });

  it("a command that changes nothing emits nothing", () => {
    const { service, updated } = makeService();
    service.undo();
    expect(updated).not.toHaveBeenCalled();
    expect(service.revision).toBe(0);
  });
});

describe("active", () => {
  it("tracks the marks at the selection", () => {
    const { service } = makeService();
    service.load(hello);
    select(service, 1, 6);
    expect(service.active.bold).toBe(false);
    service.toggle("bold");
    expect(service.active.bold).toBe(true);
    expect(service.isActive("bold")).toBe(true);
  });

  it("writes the snapshot only when it changes", () => {
    const { service, change } = makeService();
    service.load(hello);
    const before = change.mock.calls.filter(
      ([c]) => c.field === "active",
    ).length;
    select(service, 1, 3);
    select(service, 2, 4);
    const after = change.mock.calls.filter(
      ([c]) => c.field === "active",
    ).length;
    expect(after).toBe(before);
  });
});

describe("commands", () => {
  it("toggle applies and removes a mark", () => {
    const { service } = makeService();
    service.load(hello);
    select(service, 1, 6);
    expect(service.toggle("italic")).toBe(true);
    expect(service.json.content?.[0]?.content?.[0]?.marks).toEqual([
      { type: "italic" },
    ]);
    service.toggle("italic");
    expect(service.json.content?.[0]?.content?.[0]?.marks).toBeUndefined();
  });

  it("block toggles a node and back to a paragraph", () => {
    const { service } = makeService();
    service.load(hello);
    select(service, 1, 1);
    service.block("heading", { level: 3 });
    expect(service.json.content?.[0]).toMatchObject({
      type: "heading",
      attrs: { level: 3 },
    });
    expect(service.isActive("heading", { level: 3 })).toBe(true);
    service.block("heading", { level: 3 });
    expect(service.json.content?.[0]?.type).toBe("paragraph");
  });

  it("wrap toggles a wrapping node", () => {
    const { service } = makeService();
    service.load(hello);
    select(service, 1, 1);
    service.wrap("blockquote");
    expect(service.json.content?.[0]?.type).toBe("blockquote");
    expect(service.active.blockquote).toBe(true);
    service.wrap("blockquote");
    expect(service.json.content?.[0]?.type).toBe("paragraph");
  });

  it("list toggles a list", () => {
    const { service } = makeService();
    service.load(hello);
    select(service, 1, 1);
    service.list("bulletList");
    expect(service.json.content?.[0]?.type).toBe("bulletList");
    service.list("bulletList");
    expect(service.json.content?.[0]?.type).toBe("paragraph");
  });

  it("insert adds content at the selection", () => {
    const { service } = makeService();
    service.insert([paragraph("One"), paragraph("Two")]);
    expect(service.json.content?.map((n) => n.content?.[0]?.text)).toEqual([
      "One",
      "Two",
    ]);
  });

  it("undo and redo walk the history", () => {
    const { service } = makeService();
    service.load(hello);
    service.insert(paragraph("More"));
    const edited = service.json;
    expect(service.undo()).toBe(true);
    expect(service.json).toEqual(hello);
    expect(service.redo()).toBe(true);
    expect(service.json).toEqual(edited);
  });

  it("undo is refused when history is off", () => {
    const { service } = makeService({ config: { history: false } });
    service.insert(paragraph("More"));
    expect(service.undo()).toBe(false);
  });

  it("run chains arbitrary commands", () => {
    const { service } = makeService();
    service.load(hello);
    const ran = service.run((chain) =>
      chain.setTextSelection({ from: 1, to: 6 }).toggleBold().toggleItalic(),
    );
    expect(ran).toBe(true);
    expect(service.active.bold).toBe(true);
    expect(service.active.italic).toBe(true);
  });
});

describe("element", () => {
  it("focus is refused while unmounted", () => {
    const { service } = makeService();
    expect(service.focus()).toBe(false);
  });

  it("mount throws with no document in the environment and stays unmounted", () => {
    const { service, mounted } = makeService();
    // Node has no DOM: tiptap refuses to create a view.
    expect(() => service.mount({} as HTMLElement)).toThrow("no 'document'");
    expect(service.mounted).toBe(false);
    expect(mounted).not.toHaveBeenCalled();
  });

  it("unmount is a no-op while unmounted", () => {
    const { service, unmounted } = makeService();
    service.unmount();
    expect(unmounted).not.toHaveBeenCalled();
  });

  it("destroy leaves the editor unmounted and silent", () => {
    const { service, unmounted } = makeService();
    service.destroy();
    expect(service.mounted).toBe(false);
    expect(unmounted).not.toHaveBeenCalled();
  });
});

describe("options", () => {
  it("get middleware shapes a read", () => {
    const { service } = makeService({
      options: { get: { state: { revision: (r) => r * 10 } } },
    });
    service.load(hello);
    expect(service.revision).toBe(10);
  });

  it("set middleware shapes a write", () => {
    const { service, state } = makeService({
      options: { set: { state: { empty: () => true } } },
    });
    service.load(hello);
    expect(state.empty).toBe(true);
  });
});
