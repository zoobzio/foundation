import type { TableColumnsProps } from "../../src/types/components/table-columns";
import type { FakeRow } from "#test/data/table";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import TableColumns from "../../src/components/table-columns.vue";
import { makeTable } from "#test/mount/table";

const mounted: { unmount: () => void }[] = [];

const mountColumns = (props: TableColumnsProps<FakeRow>) => {
  const wrapper = mount(TableColumns<FakeRow>, {
    props,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const items = () => document.body.querySelectorAll(".f-listbox-item");

describe("table-columns", () => {
  it("opens on trigger interaction and emits update:open", async () => {
    const { service } = makeTable();
    const wrapper = mountColumns({ service });
    expect(items()).toHaveLength(0);
    await wrapper
      .get("button.f-button")
      .trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    expect(wrapper.emitted("update:open")).toEqual([[true]]);
    expect(items()).toHaveLength(service.columns.length);
  });

  it("follows a controlled open prop", async () => {
    const { service } = makeTable();
    const wrapper = mountColumns({ service, open: true });
    await flushPromises();
    expect(items()).toHaveLength(service.columns.length);
    await wrapper.setProps({ open: false });
    await flushPromises();
    expect(items()).toHaveLength(0);
  });
});
