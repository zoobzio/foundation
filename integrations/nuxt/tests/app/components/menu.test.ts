// The menu wrapper: NuxtLink under the `link` part, select and open relayed.
import type { MenuGroup } from "@zoobzio/vue/types/components/menu";

import { afterEach, describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Menu from "../../../app/components/menu.vue";

const groups: MenuGroup[] = [
  {
    key: "mixed",
    items: [
      { label: "Profile", link: { to: "/profile" } },
      { label: "Archived", disabled: true, link: { to: "/archived" } },
      { label: "Sign out" },
    ],
  },
];

const mounted: { unmount: () => void }[] = [];

const mountMenu = async (props: { pt?: object } = {}) => {
  const wrapper = mount(Menu, {
    props: { label: "Open", groups, ...props },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await wrapper.get("button.f-button").trigger("click", {
    button: 0,
    ctrlKey: false,
  });
  await flushPromises();
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
});
