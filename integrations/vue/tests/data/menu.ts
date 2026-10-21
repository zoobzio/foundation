import type { MenuGroup } from "../../src/types/components/menu";

/**
 * Groups with and without a label.
 */
export const fakeMenuGroups: MenuGroup[] = [
  {
    key: "actions",
    items: [{ label: "Edit" }, { label: "Delete" }],
  },
  {
    key: "navigation",
    label: "Navigate",
    items: [{ label: "Home" }, { label: "Settings" }],
  },
];

/**
 * One group with linked entries and one plain entry.
 */
export const fakeLinkedMenuGroups: MenuGroup[] = [
  {
    key: "mixed",
    items: [
      { label: "Profile", link: { to: "/profile" } },
      { label: "Docs", link: { to: "https://docs.example", target: "_blank" } },
      { label: "Archived", disabled: true, link: { to: "/archived" } },
      { label: "Sign out" },
    ],
  },
];
