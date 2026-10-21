import type { AutocompleteProps } from "../../src/types/components/autocomplete";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { reactive } from "vue";
import { QueryService, createQueryState } from "@zoobzio/query";
import Autocomplete from "../../src/components/autocomplete.vue";

const mounted: { unmount: () => void }[] = [];

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
      },
    },
    reactive(createQueryState()),
  );

const mountAutocomplete = (props: AutocompleteProps) => {
  const wrapper = mount(Autocomplete, { props, attachTo: document.body });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
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
});
