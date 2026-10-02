// Core component test in the select.test.ts mold: the menu opens through a
// real trigger click and its content teleports to document.body.
// NuxtLink is imported from #components, stubbed to a bare <a> that maps
// `to` → `href`.
import { afterEach, describe, expect, it } from "vitest";
import type { FunctionalComponent } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Core from "../../../../app/components/core/menu.vue";
import { fakeLinkedMenuGroups } from "#test/data/menu";
import type {
  MenuEmits,
  MenuItem,
  MenuProps,
} from "../../../../app/types/core/menu";

// Generic SFCs don't instantiate through mount()'s types — assigning to a
// concretely-typed FunctionalComponent instantiates T for the harness.
const Menu: FunctionalComponent<
  MenuProps<MenuItem>,
  MenuEmits<MenuItem>
> = Core;

const mounted: { unmount: () => void }[] = [];

const mountMenu = async (props: Partial<MenuProps<MenuItem>> = {}) => {
  const wrapper = mount(Menu, {
    props: { label: "Open", groups: fakeLinkedMenuGroups, ...props },
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

const items = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'));

const itemByText = (label: string) => {
  const found = items().find((el) => el.textContent?.includes(label));
  if (!found) throw new Error(`no rendered menu item "${label}"`);
  return found;
};

const item = (label: string): MenuItem => {
  const found = fakeLinkedMenuGroups
    .flatMap((group) => group.items)
    .find((entry) => entry.label === label);
  if (!found) throw new Error(`no fixture item ${label}`);
  return found;
};

describe("menu", () => {
  it("linked items render as the menuitem anchor itself", async () => {
    await mountMenu();
    const profile = itemByText("Profile");
    expect(profile.tagName).toBe("A");
    expect(profile.getAttribute("href")).toBe("/profile");
    expect(profile.classList).toContain("f-dropdown-menu-item");
    expect(profile.querySelector("a")).toBeNull();
    expect(itemByText("Docs").getAttribute("target")).toBe("_blank");
  });

  it("plain items stay emit-only, with no anchor", async () => {
    await mountMenu();
    const signOut = itemByText("Sign out");
    expect(signOut.tagName).not.toBe("A");
    expect(signOut.querySelector("a")).toBeNull();
  });

  it("disabled linked items drop their href", async () => {
    await mountMenu();
    const archived = itemByText("Archived");
    expect(archived.tagName).toBe("A");
    expect(archived.hasAttribute("href")).toBe(false);
    expect(archived.getAttribute("aria-disabled")).toBe("true");
  });

  it("activating a linked item still emits select", async () => {
    const wrapper = await mountMenu();
    itemByText("Profile").click();
    await flushPromises();
    expect(wrapper.emitted("select")).toEqual([[item("Profile")]]);
  });
});
