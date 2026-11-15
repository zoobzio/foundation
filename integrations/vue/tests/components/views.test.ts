import { afterEach, describe, expect, it } from "vitest";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../src/components/views.vue";
import type { ViewsEmits, ViewsProps } from "../../src/types/components/views";
import { makeViews } from "#test/mount/views";
import type { FakeView } from "#test/mount/views";

// A concrete FunctionalComponent type instantiates P for mount().
const Views: FunctionalComponent<
  ViewsProps<FakeView>,
  ViewsEmits<FakeView>
> = Core;

const mounted: { unmount: () => void }[] = [];

const mountViews = async (
  wiring: Parameters<typeof makeViews>[0] = {},
  options: { slots?: Record<string, string> } = {},
) => {
  const made = await makeViews(wiring);
  const wrapper = mount(Views, {
    props: { service: made.service },
    attachTo: document.body,
    ...options,
  });
  mounted.push(wrapper);
  await flushPromises();
  return { wrapper, ...made };
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

type Mounted = Awaited<ReturnType<typeof mountViews>>;

const tab = ({ wrapper }: Mounted, label: string) => {
  const found = wrapper
    .findAll('[role="tab"]')
    .find((el) => el.text() === label);
  if (!found) throw new Error(`no rendered tab "${label}"`);
  return found;
};

const pick = async (made: Mounted, label: string) => {
  // reka's tabs activate on mousedown.
  await tab(made, label).trigger("mousedown", { button: 0, ctrlKey: false });
  await flushPromises();
};

const openMenu = async ({ wrapper }: Mounted) => {
  await wrapper.get(".f-views > button.f-button").trigger("click", {
    button: 0,
    ctrlKey: false,
  });
  await flushPromises();
};

const menuItem = (label: string) => {
  const found = Array.from(
    document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((el) => el.textContent?.trim() === label);
  if (!found) throw new Error(`no rendered menu item "${label}"`);
  return found;
};

const choose = async (made: Mounted, label: string) => {
  await openMenu(made);
  menuItem(label).click();
  await flushPromises();
};

const dialog = () =>
  document.body.querySelector<HTMLElement>('[role="dialog"]');

const press = async (cls: string) => {
  const button = dialog()?.querySelector<HTMLButtonElement>(`button.${cls}`);
  if (!button) throw new Error(`no dialog button ".${cls}"`);
  button.click();
  await flushPromises();
};

const type = async (value: string) => {
  const input = dialog()?.querySelector<HTMLInputElement>("input.f-views-name");
  if (!input) throw new Error("no name input");
  input.value = value;
  input.dispatchEvent(new Event("input"));
  await flushPromises();
};

const submit = async () => {
  dialog()?.querySelector("form")?.dispatchEvent(new Event("submit"));
  await flushPromises();
};

describe("tabs", () => {
  it("lists the views with the active one selected", async () => {
    const made = await mountViews();
    expect(made.wrapper.findAll('[role="tab"]').map((el) => el.text())).toEqual(
      ["All", "Recent", "Mine"],
    );
    expect(tab(made, "All").attributes("aria-selected")).toBe("true");
    expect(made.wrapper.find(".f-views-badge").exists()).toBe(false);
  });

  it("selects a view and relays the event", async () => {
    const made = await mountViews();
    await pick(made, "Recent");
    expect(made.service.active).toBe("recent");
    expect(made.target.live).toEqual({ sort: "created", size: 25 });
    expect(tab(made, "Recent").attributes("aria-selected")).toBe("true");
    expect(made.wrapper.emitted("selected")).toHaveLength(1);
  });

  it("badges the active tab once the target drifts", async () => {
    const made = await mountViews();
    made.target.live = { sort: null, size: 99 };
    await flushPromises();
    expect(made.wrapper.classes()).toContain("f-views-drifted");
    expect(tab(made, "All").find(".f-views-badge").exists()).toBe(true);
    expect(tab(made, "Recent").find(".f-views-badge").exists()).toBe(false);

    made.target.live = { sort: null, size: 10 };
    await flushPromises();
    expect(made.wrapper.find(".f-views-badge").exists()).toBe(false);
  });

  it("renders the badge slot with the tab", async () => {
    const made = await mountViews(
      {},
      {
        slots: {
          badge: `<template #badge="{ option }"><i class="mark">{{ option.origin }}</i></template>`,
        },
      },
    );
    expect(
      made.wrapper.findAll('[role="tab"] .mark').map((el) => el.text()),
    ).toEqual(["system", "system", "user"]);
  });
});

describe("menu", () => {
  const disabled = (label: string) =>
    menuItem(label).hasAttribute("data-disabled");

  it("offers a system view a copy alone", async () => {
    const made = await mountViews();
    await openMenu(made);
    expect(disabled("Save")).toBe(true);
    expect(disabled("Save as...")).toBe(false);
    expect(disabled("Rename")).toBe(true);
    expect(disabled("Discard changes")).toBe(true);
    expect(disabled("Delete")).toBe(true);
  });

  it("offers the user's own view everything once it drifts", async () => {
    const made = await mountViews();
    await pick(made, "Mine");
    made.target.live = { sort: "name", size: 5 };
    await flushPromises();
    await openMenu(made);
    for (const label of ["Save", "Rename", "Discard changes", "Delete"]) {
      expect(disabled(label)).toBe(false);
    }
  });

  it("saves the edits", async () => {
    const made = await mountViews();
    await pick(made, "Mine");
    made.target.live = { sort: "name", size: 5 };
    await flushPromises();
    await choose(made, "Save");
    expect(made.save).toHaveBeenCalledOnce();
    expect(made.service.drifted).toBe(false);
    expect(made.wrapper.emitted("saved")).toHaveLength(1);
    expect(made.wrapper.find(".f-views-badge").exists()).toBe(false);
  });

  it("saves as a new view under the name typed", async () => {
    const made = await mountViews();
    made.target.live = { sort: null, size: 99 };
    await choose(made, "Save as...");
    expect(dialog()?.textContent).toContain("Save as a new view");
    await submit();
    expect(made.save).not.toHaveBeenCalled();

    await type("Big");
    await submit();
    expect(made.service.current).toMatchObject({ id: "new", name: "Big" });
    expect(dialog()).toBeNull();
    expect(tab(made, "Big").attributes("aria-selected")).toBe("true");
  });

  it("renames the active view, starting from its name", async () => {
    const made = await mountViews();
    await pick(made, "Mine");
    await choose(made, "Rename");
    const input = dialog()?.querySelector<HTMLInputElement>("input");
    expect(input?.value).toBe("Mine");
    await type("Ours");
    await submit();
    expect(made.service.current?.name).toBe("Ours");
    expect(made.wrapper.emitted("renamed")).toHaveLength(1);
  });

  it("cancels a name", async () => {
    const made = await mountViews();
    await choose(made, "Save as...");
    await press("f-views-cancel");
    expect(dialog()).toBeNull();
    expect(made.service.views).toHaveLength(3);
  });

  it("keeps the naming dialog open when the save fails", async () => {
    const made = await mountViews();
    made.save.mockRejectedValueOnce(new Error("offline"));
    await choose(made, "Save as...");
    await type("Big");
    await submit();
    expect(dialog()).not.toBeNull();
    expect(made.wrapper.emitted("failed")).toHaveLength(1);
  });
});

describe("confirmation", () => {
  const drift = async (from?: string) => {
    const made = await mountViews();
    if (from) await pick(made, from);
    made.target.live = { ...made.target.live, size: 5 };
    await flushPromises();
    return made;
  };

  it("holds a selection over unsaved edits behind the dialog", async () => {
    const made = await drift("Mine");
    await pick(made, "Recent");
    expect(made.service.active).toBe("mine");
    expect(tab(made, "Mine").attributes("aria-selected")).toBe("true");
    expect(dialog()?.textContent).toContain("Save your changes?");
    expect(dialog()?.querySelector("input")).toBeNull();
  });

  it("saves, then switches", async () => {
    const made = await drift("Mine");
    await pick(made, "Recent");
    await press("f-views-save");
    expect(made.save).toHaveBeenCalledOnce();
    expect(made.service.active).toBe("recent");
    expect(made.service.views.at(-1)?.payload.size).toBe(5);
    expect(dialog()).toBeNull();
  });

  it("discards, then switches", async () => {
    const made = await drift("Mine");
    await pick(made, "Recent");
    await press("f-views-proceed");
    expect(made.save).not.toHaveBeenCalled();
    expect(made.service.active).toBe("recent");
    expect(made.target.live).toEqual({ sort: "created", size: 25 });
  });

  it("cancels and keeps the edits", async () => {
    const made = await drift("Mine");
    await pick(made, "Recent");
    await press("f-views-cancel");
    expect(made.service.pending).toBeNull();
    expect(made.service.active).toBe("mine");
    expect(made.target.live.size).toBe(5);
    expect(dialog()).toBeNull();
  });

  it("asks a name to save the edits of a system view", async () => {
    const made = await drift();
    await pick(made, "Recent");
    const save = dialog()?.querySelector<HTMLButtonElement>(".f-views-save");
    expect(save?.disabled).toBe(true);
    await submit();
    expect(made.service.pending).not.toBeNull();

    await type("Small");
    await submit();
    expect(made.service.views.at(-1)).toMatchObject({
      name: "Small",
      payload: { size: 5 },
    });
    expect(made.service.active).toBe("recent");
  });

  it("stays open when the save fails, with nothing lost", async () => {
    const made = await drift("Mine");
    made.save.mockRejectedValueOnce(new Error("offline"));
    await pick(made, "Recent");
    await press("f-views-save");
    expect(dialog()).not.toBeNull();
    expect(made.service.active).toBe("mine");
    expect(made.target.live.size).toBe(5);
  });

  it("confirms a discard of the edits", async () => {
    const made = await drift("Mine");
    await choose(made, "Discard changes");
    expect(dialog()?.textContent).toContain("Discard your changes?");
    expect(dialog()?.querySelector(".f-views-save")).toBeNull();
    await submit();
    expect(made.target.live).toEqual({ sort: "name", size: 50 });
    expect(made.wrapper.emitted("reverted")).toHaveLength(1);
  });

  it("confirms a delete", async () => {
    const made = await mountViews();
    await pick(made, "Mine");
    await choose(made, "Delete");
    expect(dialog()?.textContent).toContain("Delete this view?");
    expect(made.remove).not.toHaveBeenCalled();
    await press("f-views-proceed");
    expect(made.remove).toHaveBeenCalledOnce();
    expect(made.service.active).toBe("all");
    expect(made.wrapper.emitted("removed")).toHaveLength(1);
  });
});
