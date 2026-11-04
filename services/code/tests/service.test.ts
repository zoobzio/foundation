// Constructor-injected seams — a plain state container, vi.fn() reader and
// writer, and vi.fn() listeners. Every test drives a state transition and
// asserts both the new state and the side-channel contracts (seam calls,
// events).
import { describe, expect, it, vi } from "vitest";
import { EditorState } from "@codemirror/state";
import { insertNewline } from "@codemirror/commands";
import { CodeService } from "../src/service";
import { createCodeState } from "../src/state";
import type { Actions, Change, Config, Options, State } from "../src/types";
import { fakeConfig, hello, lines, passthrough } from "./data";

const makeService = (
  overrides: {
    state?: State;
    actions?: Partial<Actions<string, string>>;
    config?: Config;
    options?: Options;
  } = {},
) => {
  const config = overrides.config ?? fakeConfig;
  const state = overrides.state ?? createCodeState();
  const read = vi.fn(passthrough.read);
  const write = vi.fn(passthrough.write);
  const actions: Actions<string, string> = {
    read,
    write,
    ...overrides.actions,
  };
  const service = new CodeService<string, string>(
    "test-code",
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

describe("config", () => {
  it("exposes the id and a frozen config", () => {
    const { service } = makeService({ config: { history: false } });
    expect(service.id).toBe("test-code");
    expect(service.config).toEqual({ history: false });
    expect(Object.isFrozen(service.config)).toBe(true);
  });

  it("is not extensible, so a reactive proxy leaves it raw", () => {
    const { service } = makeService();
    expect(Object.isExtensible(service)).toBe(false);
  });

  it("exposes the extensions as the context, the consumer's first", () => {
    const tabs = EditorState.tabSize.of(2);
    const { service } = makeService({ actions: { extensions: [tabs] } });
    expect(service.context.extensions[0]).toBe(tabs);
    expect(service.context.extensions.length).toBeGreaterThan(1);
  });

  it("the feature set shapes the extensions", () => {
    const { service } = makeService({ config: { history: false } });
    expect(service.context.extensions).toEqual([]);
  });

  it("the consumer's extensions shape the state", () => {
    const { service } = makeService({
      actions: { extensions: [EditorState.tabSize.of(2)] },
    });
    service.load("\tx");
    // A tab is one character; the state's tab size is what the consumer set.
    expect(service.run((target) => target.state.tabSize === 2)).toBe(true);
  });

  it("starts empty at revision zero", () => {
    const { service } = makeService();
    expect(service.revision).toBe(0);
    expect(service.empty).toBe(true);
    expect(service.mounted).toBe(false);
    expect(service.cursor).toEqual({ line: 1, column: 1 });
    expect(service.text).toBe("");
  });
});

describe("load", () => {
  it("reads the source through the reader with the context", () => {
    const { service, read } = makeService();
    service.load(hello);
    expect(read).toHaveBeenCalledWith(hello, service.context);
    expect(service.text).toBe(hello);
  });

  it("bumps the revision, clears empty, and emits loaded, not updated", () => {
    const { service, loaded, updated } = makeService();
    service.load(hello);
    expect(service.revision).toBe(1);
    expect(service.empty).toBe(false);
    expect(loaded).toHaveBeenCalledWith({ id: "test-code", revision: 1 });
    expect(updated).not.toHaveBeenCalled();
  });

  it("puts the cursor at the origin", () => {
    const { service } = makeService();
    service.load(lines);
    service.select(6);
    service.load(hello);
    expect(service.cursor).toEqual({ line: 1, column: 1 });
  });

  it("replaces the document", () => {
    const { service } = makeService();
    service.load(hello);
    service.load("Second");
    expect(service.text).toBe("Second");
    expect(service.revision).toBe(2);
  });

  it("starts the history over", () => {
    const { service } = makeService();
    service.load(hello);
    service.insert("Edit");
    service.load("Second");
    expect(service.undo()).toBe(false);
    expect(service.text).toBe("Second");
  });

  it("an empty source is empty", () => {
    const { service } = makeService();
    service.load(hello);
    service.load("");
    expect(service.empty).toBe(true);
  });
});

describe("document", () => {
  it("writes through the writer on read, with the context", () => {
    const { service, write } = makeService();
    service.load(hello);
    expect(write).not.toHaveBeenCalled();
    expect(service.document).toBe(hello);
    expect(write).toHaveBeenCalledWith(hello, service.context);
  });

  it("writes on every read; caching is the caller's", () => {
    const { service, write } = makeService();
    expect(service.document).toBe(service.text);
    expect(service.document).toBe(service.text);
    expect(write).toHaveBeenCalledTimes(2);
  });

  it("carries the writer's form", () => {
    const state = createCodeState();
    const service = new CodeService<string, string[]>(
      "lines",
      fakeConfig,
      state,
      {
        read: passthrough.read,
        write: (document) => document.split("\n"),
      },
    );
    service.load(lines);
    expect(service.document).toEqual(["one", "two", "three"]);
  });

  it("the reader's form may differ from the writer's", () => {
    const service = new CodeService<string[], string>(
      "join",
      fakeConfig,
      createCodeState(),
      { read: (source) => source.join("\n"), write: passthrough.write },
    );
    service.load(["a", "b"]);
    expect(service.text).toBe("a\nb");
  });
});

describe("updated", () => {
  it("an edit bumps the revision and emits updated", () => {
    const { service, updated, change } = makeService();
    service.insert("Typed");
    expect(service.revision).toBe(1);
    expect(service.empty).toBe(false);
    expect(updated).toHaveBeenCalledWith({ id: "test-code", revision: 1 });
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

  it("a selection change is not an update", () => {
    const { service, updated } = makeService();
    service.load(lines);
    updated.mockClear();
    service.select(2);
    expect(updated).not.toHaveBeenCalled();
    expect(service.revision).toBe(1);
  });

  it("deleting every character sets empty", () => {
    const { service } = makeService();
    service.load(hello);
    service.insert("", { from: 0, to: hello.length });
    expect(service.empty).toBe(true);
  });
});

describe("cursor", () => {
  it("follows the selection's head", () => {
    const { service } = makeService();
    service.load(lines);
    service.select(6);
    expect(service.cursor).toEqual({ line: 2, column: 3 });
    service.select(0, 8);
    expect(service.cursor).toEqual({ line: 3, column: 1 });
  });

  it("follows an insert", () => {
    const { service } = makeService();
    service.load("ab");
    service.insert("\n", 2);
    expect(service.cursor).toEqual({ line: 2, column: 1 });
  });

  it("writes the cursor only when it changes", () => {
    const { service, change } = makeService();
    service.load(lines);
    service.select(2);
    const before = change.mock.calls.filter(
      ([c]) => c.field === "cursor",
    ).length;
    service.select(2);
    service.select(2, 2);
    const after = change.mock.calls.filter(
      ([c]) => c.field === "cursor",
    ).length;
    expect(after).toBe(before);
  });
});

describe("commands", () => {
  it("insert replaces the selection and lands the cursor after the text", () => {
    const { service } = makeService();
    service.load(hello);
    service.select(0, 5);
    expect(service.insert("Bye")).toBe(true);
    expect(service.text).toBe("Bye world");
    expect(service.cursor).toEqual({ line: 1, column: 4 });
  });

  it("insert at an offset and over a range", () => {
    const { service } = makeService();
    service.load(hello);
    expect(service.insert("!", hello.length)).toBe(true);
    expect(service.text).toBe("Hello world!");
    expect(service.insert("there", { from: 6, to: 11 })).toBe(true);
    expect(service.text).toBe("Hello there!");
  });

  it("insert is refused outside the document or with nothing to change", () => {
    const { service, updated } = makeService();
    service.load(hello);
    updated.mockClear();
    expect(service.insert("x", -1)).toBe(false);
    expect(service.insert("x", hello.length + 1)).toBe(false);
    expect(service.insert("x", { from: 5, to: 2 })).toBe(false);
    expect(service.insert("")).toBe(false);
    expect(updated).not.toHaveBeenCalled();
    expect(service.text).toBe(hello);
  });

  it("select is refused outside the document", () => {
    const { service } = makeService();
    service.load(hello);
    expect(service.select(-1)).toBe(false);
    expect(service.select(0, hello.length + 1)).toBe(false);
    expect(service.select(hello.length)).toBe(true);
    expect(service.select(3, 0)).toBe(true);
    expect(service.cursor).toEqual({ line: 1, column: 1 });
  });

  it("dispatch applies specs as one transaction", () => {
    const { service, updated } = makeService();
    service.load("ab");
    expect(
      service.dispatch(
        { changes: { from: 0, insert: "x" } },
        { changes: { from: 2, insert: "y" } },
      ),
    ).toBe(true);
    expect(service.text).toBe("xaby");
    expect(updated).toHaveBeenCalledTimes(1);
    expect(service.dispatch()).toBe(false);
  });

  it("undo and redo walk the history", () => {
    const { service } = makeService();
    service.load(hello);
    service.insert(" More", hello.length);
    const edited = service.text;
    expect(service.undo()).toBe(true);
    expect(service.text).toBe(hello);
    expect(service.redo()).toBe(true);
    expect(service.text).toBe(edited);
  });

  it("undo is refused when history is off", () => {
    const { service } = makeService({ config: { history: false } });
    service.insert("More");
    expect(service.undo()).toBe(false);
    expect(service.redo()).toBe(false);
  });

  it("run drives a CodeMirror state command", () => {
    const { service } = makeService();
    service.load("ab");
    service.select(1);
    expect(service.run(insertNewline)).toBe(true);
    expect(service.text).toBe("a\nb");
    expect(service.cursor).toEqual({ line: 2, column: 1 });
  });

  it("a command that dispatches nothing changes nothing", () => {
    const { service, updated } = makeService();
    expect(service.run(() => false)).toBe(false);
    expect(updated).not.toHaveBeenCalled();
  });
});

describe("element", () => {
  it("focus is refused while unmounted", () => {
    const { service } = makeService();
    expect(service.focus()).toBe(false);
  });

  it("locate is null while unmounted", () => {
    const { service } = makeService();
    expect(service.locate({ x: 0, y: 0 })).toBeNull();
  });

  it("mount throws with no document in the environment and stays unmounted", () => {
    const { service, mounted } = makeService();
    // Node has no DOM: CodeMirror refuses to create a view.
    expect(() => service.mount({} as HTMLElement)).toThrow("document");
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
