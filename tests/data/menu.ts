import type { MenuGroup } from "../../app/types/core/menu";

export const fakeMenuGroups: MenuGroup[] = [
  {
    key: "actions",
    items: [
      { label: "Edit" },
      { label: "Delete" },
    ],
  },
  {
    key: "navigation",
    label: "Navigate",
    items: [
      { label: "Home" },
      { label: "Settings" },
    ],
  },
];
