import type { AutocompleteProps } from "../../src/types/components/autocomplete";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { h, reactive } from "vue";
import { QueryService, createQueryState } from "@zoobzio/query";
import Autocomplete from "../../src/components/autocomplete.vue";

const mounted: { unmount: () => void }[] = [];

const MANY = Array.from({ length: 200 }, (_, i) => `v${i}`);

const makeQuery = () =>
  new QueryService(
    "test-query",
    {
      fields: {
        status: { label: "Status", values: ["Active", "Inactive"] },
        amount: {
          label: "Amount",
          operators: ["over", "under"],
          defaultOperator: "over",
        },
        many: { label: "Many", values: MANY },
      },
    },
    reactive(createQueryState()),
  );

const mountAutocomplete = (props: AutocompleteProps) => {
  const wrapper = mount(Autocomplete, { props, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

/**
 * happy-dom lays nothing out, and the virtualizer renders no rows into a
 * viewport of no height. Give the viewport ten rows of room and each row
 * its height, so the window is a real one.
 */
const VIEWPORT = 280;
const ROW = 28;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      if (this.hasAttribute("data-reka-combobox-viewport")) return VIEWPORT;
      if (this.hasAttribute("data-index")) return ROW;
      return 0;
    },
  );
});

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("autocomplete", () => {
  it("drafts into the service and submits on Enter", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    const input = wrapper.get("input");
    await input.setValue("Status: Active");
    expect(service.draft).toBe("Status: Active");
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(service.filters).toEqual([{ key: "status", value: "Active" }]);
    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("leaves an Enter reka already claimed alone", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    const input = wrapper.get("input");
    await input.setValue("alice");
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      cancelable: true,
    });
    event.preventDefault();
    input.element.dispatchEvent(event);
    await flushPromises();
    expect(service.entries).toEqual([]);
  });

  it("unwraps the last entry on Backspace over an empty draft only", async () => {
    const service = makeQuery();
    service.add({ kind: "text", value: "alice" });
    service.add({ kind: "filter", key: "status", value: "Active" });
    const wrapper = mountAutocomplete({ service });
    await flushPromises();
    const input = wrapper.get("input");
    await input.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(service.filters).toEqual([]);
    expect((input.element as HTMLInputElement).value).toBe("Status: Activ");
    await input.trigger("keydown", { key: "Backspace" });
    expect(service.text).toBe("alice");
    await input.setValue("");
    await input.trigger("keydown", { key: "Backspace" });
    await flushPromises();
    expect(service.text).toBe("");
    expect((input.element as HTMLInputElement).value).toBe("alic");
  });

  it("renders the entries as chips and removes one by click", async () => {
    const service = makeQuery();
    service.add({ kind: "text", value: "alice" });
    service.add({ kind: "filter", key: "amount", value: "40" });
    const wrapper = mountAutocomplete({ service });
    await flushPromises();
    const chips = wrapper.findAll(".f-chip");
    expect(chips.map((c) => c.text())).toEqual(['"alice"', "Amount: over 40"]);
    await chips[0]!.trigger("click");
    expect(service.entries).toEqual([
      { kind: "filter", key: "amount", op: "over", value: "40" },
    ]);
  });

  it("pt overrides reach the input", () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({
      service,
      pt: { input: { disabled: true } },
    });
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
  });

  it("renders the trail as buttons and the active panel as items", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    await wrapper.get("input").setValue("Status: ");
    await flushPromises();
    const trail = wrapper.findAll(".f-button[aria-current]");
    expect(trail.map((b) => b.text())).toEqual(["Status"]);
    const items = wrapper.findAll(".f-autocomplete-item");
    expect(items.map((i) => i.text())).toEqual(["Active", "Inactive"]);
    expect(wrapper.find(".f-autocomplete-viewport").exists()).toBe(true);
  });

  it("virtualizes the active panel", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const items = wrapper.findAll(".f-autocomplete-item");
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThan(MANY.length);
    const first = items[0]!;
    expect(first.attributes("aria-setsize")).toBe(String(MANY.length));
    expect(first.attributes("data-index")).toBeDefined();
    expect(first.attributes("aria-posinset")).toBe(
      String(Number(first.attributes("data-index")) + 1),
    );
    expect(first.text()).toBe(MANY[Number(first.attributes("data-index"))]);
  });

  it("selects a virtualized item by click", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const item = wrapper.get(".f-autocomplete-item");
    const value = item.text();
    await item.trigger("click");
    await flushPromises();
    expect(service.filters).toEqual([{ key: "many", value }]);
    expect(service.draft).toBe("");
  });

  it("pt overrides reach the virtualizer", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({
      service,
      pt: { virtualizer: { overscan: 0 } },
    });
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    expect(wrapper.findAll(".f-autocomplete-item")).toHaveLength(
      VIEWPORT / ROW,
    );
  });

  it("virtualizes a consumer's item slot by its one root", async () => {
    const service = makeQuery();
    const wrapper = mount(Autocomplete, {
      props: { service },
      slots: {
        item: (p) =>
          p.measure
            ? h("div", { class: "my-row", ref: p.measure }, p.option.label)
            : h("span", { class: "my-trail" }, p.option.label),
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const rows = wrapper.findAll(".my-row");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(MANY.length);
    expect(rows[0]!.attributes("data-index")).toBe("0");
    expect(rows[0]!.attributes("aria-setsize")).toBe(String(MANY.length));
    expect(wrapper.findAll(".my-trail").map((t) => t.text())).toEqual(["Many"]);
  });
});
