// The views wrapper: the layer's parts behind the vue views, and its text
// from the contract.
import type { ViewsProps } from "@zoobzio/vue/types/components/views";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { reactive } from "vue";
import { z } from "zod";
import { ViewsService, createViewsState } from "@zoobzio/views";
import Views from "../../../app/components/views";

const schema = z.object({ size: z.number() });
type Payload = z.output<typeof schema>;

const mounted: { unmount: () => void }[] = [];

const mountViews = async () => {
  const config = {
    schema,
    // The app's own view is named by a key of the contract.
    views: [{ id: "all", name: "table.columns", payload: { size: 10 } }],
  };
  const target = reactive<{ live: Payload }>({ live: { size: 10 } });
  const service = new ViewsService<Payload>(
    "test-views",
    config,
    reactive(createViewsState(config)),
    {
      read: () => target.live,
      apply: (payload) => {
        target.live = payload;
      },
      load: async () => [{ id: "mine", name: "Mine", payload: { size: 20 } }],
    },
  );
  await service.init();
  const props: ViewsProps<Payload> = { service };
  const wrapper = mount(Views<Payload>, { props, attachTo: document.body });
  mounted.push(wrapper);
  await flushPromises();
  return { wrapper, service, target };
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const tabs = (wrapper: Awaited<ReturnType<typeof mountViews>>["wrapper"]) =>
  wrapper.findAll('[role="tab"]');

describe("views wrapper", () => {
  it("reads a view's name from the contract where it is a key of it", async () => {
    const { wrapper } = await mountViews();
    expect(tabs(wrapper).map((tab) => tab.text())).toEqual(["Columns", "Mine"]);
  });

  it("names the menu's trigger and the edited mark from the contract", async () => {
    const { wrapper, target } = await mountViews();
    expect(
      wrapper.get(".f-views > button.f-button").attributes("aria-label"),
    ).toBe("View");
    target.live = { size: 99 };
    await flushPromises();
    expect(wrapper.get(".f-views-badge").attributes("aria-label")).toBe(
      "Edited",
    );
  });

  it("draws the settings icon before the trigger's label and expand after", async () => {
    const { wrapper } = await mountViews();
    const trigger = wrapper.get(".f-views > button.f-button");
    expect(trigger.text()).toBe("View");
    expect(
      Array.from(trigger.element.children).map(
        (child) => child.getAttribute("data-icon") ?? child.tagName,
      ),
    ).toEqual(["settings", "SPAN", "expand"]);
  });

  it("lists the actions in the visitor's locale", async () => {
    const { wrapper } = await mountViews();
    await wrapper
      .get(".f-views > button.f-button")
      .trigger("click", { button: 0, ctrlKey: false });
    await flushPromises();
    expect(
      Array.from(document.body.querySelectorAll('[role="menuitem"]')).map(
        (item) => item.textContent?.trim(),
      ),
    ).toEqual(["Save", "Save as...", "Rename", "Discard changes", "Delete"]);
  });

  it("titles the confirmation for what is pending", async () => {
    const { wrapper, service, target } = await mountViews();
    target.live = { size: 99 };
    await tabs(wrapper)[1]?.trigger("mousedown", { button: 0, ctrlKey: false });
    await flushPromises();
    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog?.textContent).toContain("Save your changes?");
    expect(dialog?.textContent).toContain(
      "This view has changes that are not saved.",
    );
    expect(dialog?.querySelector(".f-views-proceed")?.textContent?.trim()).toBe(
      "Discard",
    );
    expect(dialog?.querySelector("label")?.textContent?.trim()).toBe("Name");

    await service.resolve("cancel");
    await service.select("mine", { force: true });
    await service.remove("mine");
    await flushPromises();
    const removal = document.body.querySelector('[role="dialog"]');
    expect(removal?.textContent).toContain("Delete this view?");
    expect(
      removal?.querySelector(".f-views-proceed")?.textContent?.trim(),
    ).toBe("Delete");
  });
});
