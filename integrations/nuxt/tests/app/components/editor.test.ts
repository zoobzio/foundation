// The editor wrapper: each tool's icon before its label.
import type { Doc } from "@zoobzio/editor";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Editor from "../../../app/components/editor";
import { makeEditor } from "#test/mount/editor";
import { hello } from "#test/data/editor";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("editor wrapper", () => {
  it("draws each tool's icon before its label, one heading icon per level", () => {
    const { service } = makeEditor();
    service.load(hello);
    const wrapper = mount(Editor<Doc, Doc>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    const icon = (key: string) =>
      wrapper
        .get(`button[data-tool="${key}"] svg[data-icon]`)
        .attributes("data-icon");
    expect(icon("bold")).toBe("bold");
    expect(icon("heading-2")).toBe("heading");
    expect(icon("bulletList")).toBe("bullet-list");
    expect(icon("undo")).toBe("undo");
    expect(wrapper.get('button[data-tool="bold"]').text()).toBe("Bold");
  });
});
