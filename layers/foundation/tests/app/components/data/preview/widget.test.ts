// The preview widget's icon relays: each action fab shows its label until
// the consumer fills the matching slot. The service is built through the
// real factory and the harness drives `init()` — the widget renders the
// toolbar only once the record lands. The service's own logic has depth in
// the package and factory tests.
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { defineEntity } from "../../../../../app/definitions/entity";
import { usePreview } from "../../../../../app/factories/preview";
import Widget from "../../../../../app/components/data/preview/widget.vue";
import type {
  PreviewWidgetEmits,
  PreviewWidgetProps,
} from "../../../../../app/types/data/preview/widget";
import type { Actions } from "../../../../../app/types/data/preview";
import { fakeRows } from "#test/data/rows";
import type { FakeRow } from "#test/data/rows";

// Generic SFCs don't instantiate through h()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const PreviewWidget: FunctionalComponent<
  PreviewWidgetProps<FakeRow>,
  PreviewWidgetEmits
> = Widget;

const rows = defineEntity<FakeRow>();

const definition = rows.definePreview({
  fields: [{ key: "name", label: "Name" }],
  content: { type: "code", key: "name", language: "text" },
});

const subject = fakeRows.at(0);
if (!subject) throw new Error("fakeRows is empty");

const mountWidget = async (
  slots: Record<string, string> = {},
  { init = true } = {},
) => {
  const fetch = vi.fn<Actions<FakeRow>["fetch"]>(async () => subject);
  const widget = usePreview("p1", definition, { fetch });
  const wrapper = mount(
    defineComponent({
      setup(_, { slots: forwarded }) {
        return () => h(PreviewWidget, { service: widget.service }, forwarded);
      },
    }),
    { slots },
  );
  await flushPromises();
  if (init) {
    await widget.service.init();
    await flushPromises();
  }
  return { wrapper, fetch, service: widget.service };
};

describe("data preview widget", () => {
  it("does not init the service on mount — the caller drives init", async () => {
    const { wrapper, fetch, service } = await mountWidget({}, { init: false });
    expect(fetch).not.toHaveBeenCalled();
    expect(wrapper.find(".f-data-preview-toolbar").exists()).toBe(false);
    await service.init();
    await flushPromises();
    expect(wrapper.find(".f-data-preview-toolbar").exists()).toBe(true);
  });

  it("labels each action fab by default", async () => {
    const { wrapper } = await mountWidget();
    expect(wrapper.get('button[aria-label="Copy"]').text()).toBe("Copy");
    expect(wrapper.get('button[aria-label="Download"]').text()).toBe(
      "Download",
    );
  });

  it("relays the action icon slots into their fabs", async () => {
    const { wrapper } = await mountWidget({
      copyIcon: `<template #copyIcon="s"><i>{{ s.preview.id }}</i></template>`,
      downloadIcon: `<template #downloadIcon><b /></template>`,
    });
    const copy = wrapper.get('button[aria-label="Copy"]');
    expect(copy.get("i").text()).toBe("p1");
    expect(copy.find(".f-span").exists()).toBe(false);
    expect(
      wrapper.get('button[aria-label="Download"]').find("b").exists(),
    ).toBe(true);
  });
});
