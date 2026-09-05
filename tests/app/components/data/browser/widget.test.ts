// Data-widget test in the table widget.test.ts mold. The contract mock is
// the unit seam — browser state logic has its depth in
// tests/app/services/browser.test.ts. Sibling feature parts
// (Folders/Files/BulkActions) are stubbed: their behavior belongs to their
// own files. The breadcrumb and refresh fab render real because the
// widget's wiring to them (crumb → navigate, refresh → fetch) is the
// behavior under test here.
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useNuxtApp } from "#imports";
import Widget from "../../../../../app/components/data/browser/widget.vue";
import type {
  BrowserWidgetEmits,
  BrowserWidgetProps,
} from "../../../../../app/types/data/browser/widget";
import { createMockBrowser } from "#test/mocks/browser";
import { browserStubs } from "#test/stubs/data";
import type { FakeFile } from "#test/data/browser";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const BrowserWidget: FunctionalComponent<
  BrowserWidgetProps<FakeFile>,
  BrowserWidgetEmits
> = Widget;

const mountWidget = (mock = createMockBrowser()) => {
  const updated: { id: string }[] = [];
  const navigated: { id: string; path: string[] }[] = [];
  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(BrowserWidget, {
            service: mock.service,
            onUpdated: (event: { id: string }) => updated.push(event),
            onNavigated: (event: { id: string; path: string[] }) =>
              navigated.push(event),
          });
      },
    }),
    { global: { stubs: browserStubs } },
  );
  return { ...mock, wrapper, updated, navigated };
};

describe("data browser widget", () => {
  it("kicks off browser init through the lazy request", async () => {
    const { service } = mountWidget();
    await flushPromises();
    expect(service.init).toHaveBeenCalledOnce();
  });

  it("renders the toolbar and stubbed feature parts inside the frame", () => {
    const { wrapper } = mountWidget();
    expect(wrapper.find(".f-data-browser").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Folders" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Files" }).exists()).toBe(true);
  });

  it("hides the folders section when the folder has no subfolders", async () => {
    const { state, wrapper } = mountWidget();
    state.folders.value = [];
    await flushPromises();
    expect(wrapper.findComponent({ name: "Folders" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "Files" }).exists()).toBe(true);
  });

  it("swaps the body for the empty state when nothing is inside", async () => {
    const { state, wrapper } = mountWidget();
    state.folders.value = [];
    state.files.value = [];
    await flushPromises();
    expect(wrapper.find(".f-data-browser-empty").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Files" }).exists()).toBe(false);
  });

  it("renders the trail as breadcrumbs from the root", async () => {
    const { state, wrapper } = mountWidget();
    state.path.value = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    await flushPromises();
    const crumbs = wrapper.get(".f-data-browser-breadcrumb");
    expect(crumbs.findAll("li").map((li) => li.text())).toEqual([
      "Home",
      "Media",
      "2025",
    ]);
    expect(crumbs.get('[aria-current="page"]').text()).toBe("2025");
  });

  it("ancestor crumb activation routes through browser.navigate", async () => {
    const { service, state, wrapper } = mountWidget();
    state.path.value = [
      { key: "media", label: "Media" },
      { key: "2025", label: "2025" },
    ];
    await flushPromises();
    const media = wrapper
      .findAll(".f-data-browser-breadcrumb button")
      .find((b) => b.text() === "Media");
    if (!media) throw new Error("no Media crumb rendered");
    await media.trigger("click");
    expect(service.navigate).toHaveBeenCalledWith(1);
  });

  it("refresh control triggers a browser fetch", async () => {
    const { service, wrapper } = mountWidget();
    const refresh = wrapper
      .get('use[href="#refresh"]')
      .element.closest("button");
    if (!refresh) throw new Error("refresh fab has no button root");
    refresh.click();
    expect(service.fetch).toHaveBeenCalledOnce();
  });

  it("shows bulk actions only while files are selected", async () => {
    const { state, wrapper } = mountWidget();
    expect(wrapper.findComponent({ name: "BulkActions" }).exists()).toBe(
      false,
    );
    state.selected.value = new Set(["1"]);
    await flushPromises();
    expect(wrapper.findComponent({ name: "BulkActions" }).exists()).toBe(true);
  });

  it("re-emits domain hooks for its own id only", async () => {
    const { updated, navigated } = mountWidget();
    const nuxt = useNuxtApp();
    await nuxt.callHook("browser:updated", {
      id: "mock-browser",
      path: [],
      folders: 3,
      files: 3,
    });
    await nuxt.callHook("browser:updated", {
      id: "other-browser",
      path: [],
      folders: 0,
      files: 0,
    });
    await nuxt.callHook("browser:navigated", {
      id: "mock-browser",
      path: ["media"],
    });
    expect(updated).toEqual([
      { id: "mock-browser", path: [], folders: 3, files: 3 },
    ]);
    expect(navigated).toEqual([{ id: "mock-browser", path: ["media"] }]);
  });
});
