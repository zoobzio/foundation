// The editor composable over a real service and a detached host.
import { describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import { useEditor } from "../../src/composables/editor";
import { makeEditor } from "#test/mount/editor";
import { withSetup } from "#test/mount/composable";
import { hello, paragraph } from "#test/data/editor";

const setup = () => {
  const { service } = makeEditor();
  const host = ref<HTMLElement | null>(document.createElement("div"));
  const { result, app } = withSetup(() => useEditor(service, host));
  return { service, host, app, ...result };
};

describe("useEditor", () => {
  it("renders the document as markup and follows load while off", async () => {
    const { service, markup } = setup();
    expect(markup.value).toBe("<p></p>");
    service.load(hello);
    await nextTick();
    expect(markup.value).toBe("<p>Hello world</p>");
  });

  it("builds the tools from the service", () => {
    const { tools } = setup();
    expect(tools.value.map((tool) => tool.key)).toContain("bold");
  });

  it("activate mounts the editor over the host once", () => {
    const { service, host, activate } = setup();
    service.load(hello);
    activate();
    expect(service.mounted).toBe(true);
    expect(host.value?.classList.contains("ProseMirror")).toBe(true);
    expect(host.value?.textContent).toBe("Hello world");
    activate();
    expect(service.mounted).toBe(true);
  });

  it("activate is a no-op with no host", () => {
    const { service } = makeEditor();
    const { result } = withSetup(() => useEditor(service, () => null));
    result.activate();
    expect(service.mounted).toBe(false);
  });

  it("the markup freezes at mount", async () => {
    const { service, activate, markup } = setup();
    activate();
    service.load(hello);
    await nextTick();
    expect(markup.value).toBe("<p></p>");
    service.insert(paragraph("More"));
    await nextTick();
    expect(markup.value).toBe("<p></p>");
  });

  it("unmounts the editor with the scope", () => {
    const { service, app, activate } = setup();
    activate();
    app.unmount();
    expect(service.mounted).toBe(false);
  });
});
