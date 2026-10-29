// The accordion wrapper: an item's `icon` before its label, `expand` after.
import type { Option } from "@zoobzio/vue/types/common";

import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Accordion from "../../../app/components/accordion";

const items: Option[] = [
  { value: "a", label: "Alpha", icon: "folder" },
  { value: "b", label: "Beta" },
];

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const mountAccordion = (slots: Record<string, string> = {}) => {
  const wrapper = mount(Accordion<Option>, {
    props: { items, type: "multiple" },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

describe("accordion wrapper", () => {
  it("draws an item's icon before its label and expand after it", () => {
    const wrapper = mountAccordion();
    const [alpha, beta] = wrapper.findAll("button.f-accordion-trigger");
    expect(
      alpha?.findAll("svg[data-icon]").map((s) => s.attributes("data-icon")),
    ).toEqual(["folder", "expand"]);
    expect(
      beta?.findAll("svg[data-icon]").map((s) => s.attributes("data-icon")),
    ).toEqual(["expand"]);
  });

  it("lets a consumer's triggerAppend win over the expand icon", () => {
    const wrapper = mountAccordion({
      triggerAppend: `<template #triggerAppend="{ open }"><i>{{ open }}</i></template>`,
    });
    expect(wrapper.find('svg[data-icon="expand"]').exists()).toBe(false);
    expect(wrapper.get("button.f-accordion-trigger i").text()).toBe("false");
  });
});
