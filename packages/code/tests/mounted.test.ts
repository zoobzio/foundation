// @vitest-environment happy-dom
// The service over a real view. happy-dom fires `selectionchange` in the
// same tick as the selection write, where a browser queues it; CodeMirror
// then re-enters its own update. The listener is deferred here, as a
// browser would, so the view behaves as it does in one.
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { CodeService } from "../src/service";
import { createCodeState } from "../src/state";
import { hello, lines, passthrough } from "./data";

beforeAll(() => {
  const wrapped = new WeakMap<EventListener, EventListener>();
  const add = document.addEventListener.bind(document);
  const remove = document.removeEventListener.bind(document);
  document.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    if (type === "selectionchange" && typeof listener === "function") {
      const deferred: EventListener = (event) => {
        queueMicrotask(() => listener(event));
      };
      wrapped.set(listener, deferred);
      return add(type, deferred, options);
    }
    return add(type, listener, options);
  }) as typeof document.addEventListener;
  document.removeEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) =>
    remove(
      type,
      typeof listener === "function"
        ? (wrapped.get(listener) ?? listener)
        : listener,
      options,
    )) as typeof document.removeEventListener;
});

const makeMounted = () => {
  const service = new CodeService<string, string>(
    "test-code",
    {},
    createCodeState(),
    passthrough,
  );
  const host = document.createElement("div");
  host.innerHTML = "<pre>static</pre>";
  document.body.appendChild(host);
  const mounted = vi.fn();
  const unmounted = vi.fn();
  const updated = vi.fn();
  service.on("mounted", mounted);
  service.on("unmounted", unmounted);
  service.on("updated", updated);
  return { service, host, mounted, unmounted, updated };
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("mount", () => {
  it("puts the view's DOM in the host in place of its content", () => {
    const { service, host, mounted } = makeMounted();
    service.load(hello);
    service.mount(host);
    expect(service.mounted).toBe(true);
    expect(host.querySelector("pre")).toBeNull();
    expect(host.firstElementChild?.classList.contains("cm-editor")).toBe(true);
    expect(host.textContent).toContain(hello);
    expect(mounted).toHaveBeenCalledWith({ id: "test-code" });
  });

  it("mount while mounted is a no-op", () => {
    const { service, host, mounted } = makeMounted();
    service.mount(host);
    service.mount(host);
    expect(host.querySelectorAll(".cm-editor").length).toBe(1);
    expect(mounted).toHaveBeenCalledTimes(1);
  });

  it("the view shows a load and an edit", () => {
    const { service, host } = makeMounted();
    service.mount(host);
    service.load(hello);
    expect(host.textContent).toContain(hello);
    service.insert("!", hello.length);
    expect(host.textContent).toContain("Hello world!");
    expect(service.text).toBe("Hello world!");
  });

  it("a transaction from the view settles into the service", () => {
    const { service, host, updated } = makeMounted();
    service.load(lines);
    service.mount(host);
    const view = host.querySelector(".cm-content");
    expect(view).not.toBeNull();
    // What a keystroke does: the view dispatches.
    service.run((target) => {
      target.dispatch(
        target.state.update({ changes: { from: 0, insert: "x" } }),
      );
      return true;
    });
    expect(service.text).toBe("xone\ntwo\nthree");
    expect(service.revision).toBe(2);
    expect(updated).toHaveBeenCalledWith({ id: "test-code", revision: 2 });
  });

  it("undo walks history through the view", () => {
    const { service, host } = makeMounted();
    service.load(hello);
    service.mount(host);
    service.insert("!", hello.length);
    expect(service.undo()).toBe(true);
    expect(service.text).toBe(hello);
    expect(host.textContent).not.toContain("!");
  });

  it("focus places the selection and takes focus", async () => {
    const { service, host } = makeMounted();
    service.load(lines);
    service.mount(host);
    expect(service.focus("end")).toBe(true);
    expect(service.cursor).toEqual({ line: 3, column: 6 });
    expect(document.activeElement?.classList.contains("cm-content")).toBe(true);
    service.focus("start");
    expect(service.cursor).toEqual({ line: 1, column: 1 });
    service.focus("all");
    expect(service.cursor).toEqual({ line: 3, column: 6 });
    service.focus(4);
    expect(service.cursor).toEqual({ line: 2, column: 1 });
    service.focus(99);
    expect(service.cursor).toEqual({ line: 3, column: 6 });
    await Promise.resolve();
  });

  it("locate answers an offset while mounted", () => {
    const { service, host } = makeMounted();
    service.load(hello);
    service.mount(host);
    // happy-dom lays nothing out: every point is the start.
    expect(service.locate({ x: 10, y: 10 })).toBe(0);
  });

  it("unmount removes the view and keeps the document", () => {
    const { service, host, unmounted } = makeMounted();
    service.load(hello);
    service.mount(host);
    service.insert("!", hello.length);
    service.unmount();
    expect(service.mounted).toBe(false);
    expect(host.querySelector(".cm-editor")).toBeNull();
    expect(service.text).toBe("Hello world!");
    expect(unmounted).toHaveBeenCalledWith({ id: "test-code" });
    expect(service.undo()).toBe(true);
    expect(service.text).toBe(hello);
  });

  it("mounts again after unmount", () => {
    const { service, host } = makeMounted();
    service.load(hello);
    service.mount(host);
    service.unmount();
    service.mount(host);
    expect(service.mounted).toBe(true);
    expect(host.textContent).toContain(hello);
  });

  it("destroy removes the view and emits unmounted", () => {
    const { service, host, unmounted } = makeMounted();
    service.mount(host);
    service.destroy();
    expect(service.mounted).toBe(false);
    expect(host.querySelector(".cm-editor")).toBeNull();
    expect(unmounted).toHaveBeenCalledWith({ id: "test-code" });
  });
});
