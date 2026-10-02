import type { MenuGroup } from "../../app/types/core/menu";

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

/** Mixed group: linked entries navigate, the plain entry is an action. */
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
