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
 * viewport of no height. Give the scroll area's viewport ten rows of room
 * and each row its height, so the window is a real one.
 */
const VIEWPORT = 280;
const ROW = 28;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      if (this.hasAttribute("data-reka-scroll-area-viewport")) return VIEWPORT;
      if (this.hasAttribute("data-index")) return ROW;
      return 0;
    },
  );
});

/**
 * The virtualizer measures a row by its bounding rect. Give each row its
 * height there too, so a measurement can differ from the estimate.
 */
const measureRows = () => {
  const rect = (height: number): DOMRect =>
    ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: height,
      width: 0,
      height,
      toJSON: () => ({}),
    }) as DOMRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return rect(this.hasAttribute("data-index") ? ROW : 0);
    },
  );
};

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

  it("scrolls the active panel in the scroller, the virtualizer its child", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    await wrapper.get("input").setValue("Status: ");
    await flushPromises();
    const viewport = wrapper.get(".f-autocomplete-viewport");
    expect(viewport.classes()).toContain("f-scroll-area-root");
    const virtualizer = viewport.get("[data-reka-virtualizer]");
    expect(
      virtualizer.element.parentElement?.hasAttribute(
        "data-reka-scroll-area-viewport",
      ),
    ).toBe(true);
  });

  it("pt overrides reach the scroller", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({
      service,
      pt: { viewport: { type: "always" } },
    });
    await wrapper.get("input").setValue("Status: ");
    await flushPromises();
    expect(wrapper.find(".f-scroll-area-scrollbar").exists()).toBe(true);
    expect(wrapper.get("[data-reka-virtualizer]").element.parentElement).toBe(
      wrapper.get("[data-reka-scroll-area-viewport]").element,
    );
  });

  it("virtualizes the active panel", async () => {
    const service = makeQuery();
    const wrapper = mountAutocomplete({ service });
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const rows = wrapper.findAll(".f-autocomplete-row");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(MANY.length);
    const first = rows[0]!;
    expect(first.attributes("data-index")).toBeDefined();
    expect(first.attributes("style")).toContain("position: absolute");
    const index = Number(first.attributes("data-index"));
    const item = first.get(".f-autocomplete-item");
    expect(item.attributes("aria-setsize")).toBe(String(MANY.length));
    expect(item.attributes("aria-posinset")).toBe(String(index + 1));
    expect(item.text()).toBe(MANY[index]);
  });

  it("moves a row to its measured position", async () => {
    measureRows();
    const service = makeQuery();
    const wrapper = mountAutocomplete({
      service,
      pt: { virtualizer: { estimateSize: 10 } },
    });
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const second = wrapper.get('.f-autocomplete-row[data-index="1"]');
    expect(second.attributes("style")).toContain(`translateY(${ROW}px)`);
    expect(second.get(".f-autocomplete-item").attributes("style")).toBe(
      undefined,
    );
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
    expect(wrapper.findAll(".f-autocomplete-row")).toHaveLength(VIEWPORT / ROW);
  });

  it("renders chipPrepend and chipAppend either side of a chip's label", async () => {
    const service = makeQuery();
    service.add({ kind: "text", value: "alice" });
    service.add({ kind: "filter", key: "status", value: "Active" });
    const wrapper = mount(Autocomplete, {
      props: { service },
      slots: {
        chipPrepend: (p) => h("i", { class: "lead" }, p.entry.kind),
        chipAppend: (p) => h("i", { class: "trail" }, String(p.index)),
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const chips = wrapper.findAll(".f-chip");
    expect(chips).toHaveLength(2);
    for (const [i, chip] of chips.entries()) {
      const [lead, trail] = chip.element.children;
      expect(lead?.classList.contains("lead")).toBe(true);
      expect(trail?.classList.contains("trail")).toBe(true);
      expect(trail?.textContent).toBe(String(i));
    }
    expect(chips.map((c) => c.get(".lead").text())).toEqual(["text", "filter"]);
    expect(chips[0]!.text()).toContain('"alice"');
  });

  it("renders inputPrepend before the chips and inputAppend after the input", async () => {
    const service = makeQuery();
    service.add({ kind: "text", value: "alice" });
    const wrapper = mount(Autocomplete, {
      props: { service, placeholder: "Find" },
      slots: {
        inputPrepend: (p) => h("i", { class: "lead" }, p.placeholder),
        inputAppend: (p) => h("kbd", { class: "trail" }, String(p.empty)),
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    const root = wrapper.get(".f-autocomplete-root").element;
    const lead = root.firstElementChild;
    expect(lead?.classList.contains("lead")).toBe(true);
    expect(lead?.textContent).toBe("Find");
    expect(lead?.nextElementSibling?.classList.contains("f-chip")).toBe(true);
    const input = wrapper.get("input").element;
    expect(input.parentElement?.previousElementSibling).toBe(
      lead?.nextElementSibling,
    );
    expect(input.nextElementSibling?.classList.contains("trail")).toBe(true);
    expect(input.nextElementSibling?.textContent).toBe("false");
  });

  it("virtualizes a consumer's item slot within the row", async () => {
    const service = makeQuery();
    const wrapper = mount(Autocomplete, {
      props: { service },
      slots: {
        item: (p) =>
          p.panel < p.service.trail.length
            ? h("span", { class: "my-trail" }, p.option.label)
            : [
                h("span", { class: "my-item" }, p.option.label),
                h("span", { class: "my-item-hint" }, String(p.index)),
              ],
      },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.get("input").setValue("Many: ");
    await flushPromises();
    const rows = wrapper.findAll(".f-autocomplete-row");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(MANY.length);
    expect(rows[0]!.attributes("data-index")).toBe("0");
    expect(rows[0]!.find(".my-item").text()).toBe(MANY[0]);
    expect(rows[0]!.find(".my-item-hint").text()).toBe("0");
    expect(wrapper.findAll(".my-trail").map((t) => t.text())).toEqual(["Many"]);
  });
});
