// The code composable over a real service and a detached host.
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { useCode } from "../../src/composables/code";
import { makeCode } from "#test/mount/code";
import { withSetup } from "#test/mount/composable";
import { hello, lines } from "#test/data/code";

const setup = () => {
  const { service } = makeCode();
  const host = ref<HTMLElement | null>(document.createElement("div"));
  const { result, app } = withSetup(() => useCode(service, host));
  return { service, host, app, ...result };
};

describe("useCode", () => {
  it("renders the text as markup and follows load while off", async () => {
    const { service, markup } = setup();
    expect(markup.value).toBe('<pre class="f-data-code-static"></pre>');
    service.load(hello);
    await nextTick();
    expect(markup.value).toBe(
      '<pre class="f-data-code-static">Hello world</pre>',
    );
  });

  it("activate mounts the editor in the host once", () => {
    const { service, host, activate } = setup();
    service.load(hello);
    activate();
    expect(service.mounted).toBe(true);
    expect(host.value?.querySelector(".cm-editor")).not.toBeNull();
    expect(host.value?.textContent).toContain("Hello world");
    activate();
    expect(service.mounted).toBe(true);
  });

  it("activate is a no-op with no host", () => {
    const { service } = makeCode();
    const { result } = withSetup(() => useCode(service, () => null));
    result.activate();
    expect(service.mounted).toBe(false);
  });

  it("a focus event starts the caret at the top", async () => {
    const { service, host, activate } = setup();
    document.body.appendChild(host.value as HTMLElement);
    service.load(lines);
    service.select(6);
    activate(new FocusEvent("focus"));
    expect(service.mounted).toBe(true);
    expect(service.cursor).toEqual({ line: 1, column: 1 });
    expect(document.activeElement?.classList.contains("cm-content")).toBe(true);
    await nextTick();
  });

  it("a pointer places the caret at its point and suppresses its mouse events", async () => {
    const { service, host, activate } = setup();
    document.body.appendChild(host.value as HTMLElement);
    service.load(lines);
    const event = new MouseEvent("pointerdown", {
      clientX: 10,
      clientY: 10,
      cancelable: true,
    });
    activate(event);
    expect(service.mounted).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    // happy-dom lays nothing out, so the located offset is the start.
    expect(service.cursor).toEqual({ line: 1, column: 1 });
    expect(document.activeElement?.classList.contains("cm-content")).toBe(true);
    await nextTick();
  });

  it("the markup freezes at mount", async () => {
    const { service, activate, markup } = setup();
    activate();
    service.load(hello);
    await nextTick();
    expect(markup.value).toBe('<pre class="f-data-code-static"></pre>');
    service.insert("More");
    await nextTick();
    expect(markup.value).toBe('<pre class="f-data-code-static"></pre>');
  });

  it("unmounts the editor with the scope", () => {
    const { service, app, activate } = setup();
    activate();
    app.unmount();
    expect(service.mounted).toBe(false);
  });
});
