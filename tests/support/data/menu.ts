import type { MenuGroup } from "#foundation/types/core/menu";

export const fakeMenuGroups: MenuGroup[] = [
  {
    key: "actions",
    items: [
      { label: "Edit", icon: "edit" },
      { label: "Delete", icon: "delete" },
    ],
  },
  {
    key: "navigation",
    label: "Navigate",
    items: [
      { label: "Home", icon: "home" },
      { label: "Settings", icon: "settings" },
    ],
  },
];
