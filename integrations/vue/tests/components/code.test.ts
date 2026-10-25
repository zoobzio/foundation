import type { CodeProps } from "../../src/types/components/code";
import type { Doc } from "@zoobzio/code";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Code from "../../src/components/code.vue";
import { makeCode } from "#test/mount/code";
import { hello, lines } from "#test/data/code";

const mounted: { unmount: () => void }[] = [];

const mountCode = (
  props: CodeProps<Doc, Doc>,
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Code<Doc, Doc>, {
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

describe("code", () => {
  it("shows the text static, with no editor, until the user interacts", () => {
    const { service } = makeCode();
    service.load("<b>");
    const wrapper = mountCode({ service });
    const host = wrapper.get(".f-data-code-content");
    expect(host.html()).toContain(
      '<pre class="f-data-code-static">&lt;b&gt;</pre>',
    );
    expect(host.attributes("tabindex")).toBe("0");
    expect(host.find(".cm-editor").exists()).toBe(false);
    expect(service.mounted).toBe(false);
    expect(wrapper.get(".f-data-code").attributes("data-mounted")).toBe(
      undefined,
    );
    expect(wrapper.emitted("mounted")).toBe(undefined);
  });

  it("the static copy follows load while unmounted", async () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    expect(wrapper.get(".f-data-code-static").text()).toBe("");
    service.load(hello);
    await nextTick();
    expect(wrapper.get(".f-data-code-static").text()).toBe("Hello world");
  });

  it("a pointer puts the editor in the host in place of the copy", async () => {
    const { service } = makeCode();
    service.load(hello);
    const wrapper = mountCode({ service });
    const host = wrapper.get(".f-data-code-content");
    await host.trigger("pointerdown", { clientX: 4, clientY: 4 });
    expect(service.mounted).toBe(true);
    expect(host.find(".f-data-code-static").exists()).toBe(false);
    expect(host.find(".cm-editor").exists()).toBe(true);
    expect(host.get(".cm-content").attributes("contenteditable")).toBe("true");
    expect(host.text()).toContain("Hello world");
    expect(wrapper.get(".f-data-code").attributes("data-mounted")).toBe("true");
    expect(wrapper.emitted("mounted")?.at(0)).toEqual([{ id: "test-code" }]);
  });

  it("keyboard focus turns the editor on once", async () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    const host = wrapper.get(".f-data-code-content");
    await host.trigger("focus");
    await host.trigger("pointerdown");
    expect(service.mounted).toBe(true);
    expect(wrapper.emitted("mounted")?.length).toBe(1);
  });

  it("the editor owns the host once on: a later load shows in the view", async () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    const host = wrapper.get(".f-data-code-content");
    await host.trigger("pointerdown");
    service.load(hello);
    await nextTick();
    expect(host.text()).toContain("Hello world");
    expect(host.find(".f-data-code-static").exists()).toBe(false);
    service.insert("!", hello.length);
    await nextTick();
    expect(host.text()).toContain("Hello world!");
  });

  it("unmounts the editor with the component", async () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    await wrapper.get(".f-data-code-content").trigger("pointerdown");
    wrapper.unmount();
    mounted.pop();
    expect(service.mounted).toBe(false);
    expect(wrapper.emitted("unmounted")?.at(0)).toEqual([{ id: "test-code" }]);
  });

  it("marks an empty document", async () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    expect(wrapper.get(".f-data-code").attributes("data-empty")).toBe("true");
    service.load(hello);
    await nextTick();
    expect(wrapper.get(".f-data-code").attributes("data-empty")).toBe(
      undefined,
    );
  });

  it("the status line follows the cursor", async () => {
    const { service } = makeCode();
    service.load(lines);
    const wrapper = mountCode({ service });
    const status = wrapper.get(".f-data-code-status");
    expect(status.attributes("role")).toBe("status");
    expect(wrapper.get(".f-data-code-cursor").text()).toBe("Ln 1, Col 1");
    service.select(6);
    await nextTick();
    const cursor = wrapper.get(".f-data-code-cursor");
    expect(cursor.text()).toBe("Ln 2, Col 3");
    expect(cursor.attributes("data-line")).toBe("2");
    expect(cursor.attributes("data-column")).toBe("3");
  });

  it("relays the service's events as emits", () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    service.load(hello);
    expect(wrapper.emitted("loaded")?.at(0)).toEqual([
      { id: "test-code", revision: 1 },
    ]);
    service.insert("!", hello.length);
    expect(wrapper.emitted("updated")?.at(0)).toEqual([
      { id: "test-code", revision: 2 },
    ]);
  });

  it("exposes the context", () => {
    const { service } = makeCode();
    const wrapper = mountCode({ service });
    const ctx = (
      wrapper.vm as unknown as {
        ctx: { id: string; code: unknown; activate: () => void };
      }
    ).ctx;
    expect(ctx.id).toBe("code");
    expect(ctx.code).toBe(service);
    ctx.activate();
    expect(service.mounted).toBe(true);
  });

  it("passthrough reaches the content host and the status line", () => {
    const { service } = makeCode();
    const wrapper = mountCode({
      service,
      pt: {
        content: { id: "host" },
        status: { id: "status" },
      },
    });
    expect(wrapper.get(".f-data-code-content").attributes("id")).toBe("host");
    expect(wrapper.get(".f-data-code-status").attributes("id")).toBe("status");
  });

  it("the status slot replaces the status line", () => {
    const { service } = makeCode();
    const wrapper = mountCode(
      { service },
      {
        status: '<footer class="custom">{{ params.code.cursor.line }}</footer>',
      },
    );
    expect(wrapper.find(".f-data-code-status").exists()).toBe(false);
    expect(wrapper.get("footer.custom").text()).toBe("1");
  });
});
