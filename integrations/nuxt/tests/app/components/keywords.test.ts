// The keywords wrapper: `keywords` as the trigger's content, the layer's
// TagsInput and SegmentedControl behind its controls.
import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Keywords from "../../../app/components/keywords";

const mounted: { unmount: () => void }[] = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

describe("keywords wrapper", () => {
  it("draws keywords as the trigger's content and remove on each tag", async () => {
    const wrapper = mount(Keywords, {
      props: { modelValue: "+alpha -beta", open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const trigger = wrapper.get('button[aria-label="Keywords"]');
    expect(trigger.get("svg[data-icon]").attributes("data-icon")).toBe(
      "keywords",
    );
    expect(trigger.find(".f-span").exists()).toBe(false);
    const removes = document.body.querySelectorAll(
      '.f-tags-input-item-delete svg[data-icon="remove"]',
    );
    expect(removes).toHaveLength(2);
  });

  it("reads its headings, placeholders and match modes from the contract", async () => {
    const wrapper = mount(Keywords, {
      props: { modelValue: "", open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const captions = Array.from(
      document.body.querySelectorAll(".f-keywords-label"),
    ).map((caption) => caption.textContent?.trim());
    expect(captions).toEqual(["Include", "Exclude", "Match"]);
    const placeholders = Array.from(
      document.body.querySelectorAll("input.f-tags-input-input"),
    ).map((input) => input.getAttribute("placeholder"));
    expect(placeholders).toEqual(["Add keyword...", "Exclude keyword..."]);
    expect(document.body.textContent).toContain("AND");
    expect(document.body.textContent).toContain("OR");
  });
});
