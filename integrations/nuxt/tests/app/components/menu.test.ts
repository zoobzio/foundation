// The menu wrapper: NuxtLink under the `link` part, an item's `icon` drawn
// in the `itemIcon` slot by default, select and open relayed.
import type { MenuGroup } from "@zoobzio/vue/types/components/menu";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import Menu from "../../../app/components/menu";

const groups: MenuGroup[] = [
  {
    key: "mixed",
    items: [
      { label: "Profile", link: { to: "/profile" }, icon: "next" },
      { label: "Archived", disabled: true, link: { to: "/archived" } },
      { label: "Sign out", icon: "close" },
    ],
  },
];

const mounted: { unmount: () => void }[] = [];

const open = async (wrapper: {
  get: (selector: string) => {
    trigger: (e: string, o: object) => Promise<void>;
  };
}) => {
  await wrapper.get("button.f-button").trigger("click", {
    button: 0,
    ctrlKey: false,
  });
  await flushPromises();
};

const mountMenu = async (
  props: { pt?: object } = {},
  slots: Record<string, string> = {},
) => {
  const wrapper = mount(Menu, {
    props: { label: "Open", groups, ...props },
    slots,
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await open(wrapper);
  return wrapper;
};

afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount();
  document.body.innerHTML = "";
});

const itemByText = (label: string) => {
  const found = Array.from(
    document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ).find((el) => el.textContent?.includes(label));
  if (!found) throw new Error(`no rendered menu item "${label}"`);
  return found;
};

describe("menu wrapper", () => {
  it("renders linked items through NuxtLink, a disabled one without an href", async () => {
    await mountMenu();
    const profile = itemByText("Profile");
    expect(profile.tagName).toBe("A");
    expect(profile.hasAttribute("data-nuxt")).toBe(true);
    expect(profile.getAttribute("href")).toBe("/profile");
    const archived = itemByText("Archived");
    expect(archived.tagName).toBe("A");
    expect(archived.hasAttribute("data-nuxt")).toBe(true);
    expect(archived.hasAttribute("href")).toBe(false);
  });

  it("composes a consumer's pt.link and relays open", async () => {
    const wrapper = await mountMenu({
      pt: { link: () => ({ class: "custom" }) },
    });
    expect(itemByText("Profile").classList.contains("custom")).toBe(true);
    expect(wrapper.emitted("update:open")?.at(0)).toEqual([true]);
  });

  it("draws an item's icon through the sprite, linked or not", async () => {
    await mountMenu();
    const icon = (label: string) =>
      itemByText(label)
        .querySelector("svg[data-icon]")
        ?.getAttribute("data-icon");
    expect(icon("Profile")).toBe("next");
    expect(icon("Sign out")).toBe("close");
    expect(
      itemByText("Profile").querySelector("use")?.getAttribute("href"),
    ).toBe("#next");
  });

  it("draws nothing for an item without an icon", async () => {
    await mountMenu();
    expect(itemByText("Archived").querySelector("svg")).toBeNull();
  });

  it("lets a consumer's itemIcon slot win over the default", async () => {
    await mountMenu(
      {},
      {
        itemIcon: `<template #itemIcon="{ item }"><i class="mine">{{ item.icon ?? "none" }}</i></template>`,
      },
    );
    expect(itemByText("Profile").querySelector("svg")).toBeNull();
    expect(itemByText("Profile").querySelector("i.mine")?.textContent).toBe(
      "next",
    );
    expect(itemByText("Archived").querySelector("i.mine")?.textContent).toBe(
      "none",
    );
  });

  it("follows a consumer slot that appears or disappears after mount", async () => {
    const mine = ref(false);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Menu,
            { label: "Open", groups },
            mine.value ? { itemIcon: () => [h("i", { class: "mine" })] } : {},
          );
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    mounted.push(wrapper);
    await open(wrapper);
    expect(
      itemByText("Profile").querySelector("svg[data-icon]"),
    ).not.toBeNull();
    expect(itemByText("Profile").querySelector("i.mine")).toBeNull();

    mine.value = true;
    await flushPromises();
    expect(itemByText("Profile").querySelector("svg[data-icon]")).toBeNull();
    expect(itemByText("Profile").querySelector("i.mine")).not.toBeNull();

    mine.value = false;
    await flushPromises();
    expect(
      itemByText("Profile").querySelector("svg[data-icon]"),
    ).not.toBeNull();
    expect(itemByText("Profile").querySelector("i.mine")).toBeNull();
  });
});
