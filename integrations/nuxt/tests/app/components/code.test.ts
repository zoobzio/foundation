// The code wrapper: its status line in the visitor's locale.
import type { Doc } from "@zoobzio/code";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Code from "../../../app/components/code";
import { createCode } from "../../../app/factories/code";
import { passthrough } from "#test/data/code";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("code wrapper", () => {
  it("reads its status line from the contract", () => {
    const useReadme = createCode<Doc, Doc>("readme-text", {
      read: passthrough.read,
      write: passthrough.write,
    });
    const service = useReadme();
    const wrapper = mount(Code<Doc, Doc>, {
      props: { service },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(wrapper.get(".f-data-code-cursor").text()).toMatch(
      /^Ln \d+, Col \d+$/,
    );
  });
});
