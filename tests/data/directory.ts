import type {
  DirectoryGroup,
  DirectoryItem,
} from "#foundation/types/core/directory";

// Extends the base item so tests can assert consumer fields survive the
// select emit round-trip.
export type FakeEntry = DirectoryItem & { section: string };

export const fakeDirectoryGroups: DirectoryGroup<FakeEntry>[] = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      {
        key: "home",
        label: "Home",
        icon: "settings",
        link: { to: "/" },
        section: "workspace",
      },
      {
        key: "contacts",
        label: "Contacts",
        link: { to: "/contacts", target: "_blank" },
        section: "workspace",
      },
      {
        key: "billing",
        label: "Billing",
        disabled: true,
        link: { to: "/billing" },
        section: "workspace",
      },
    ],
  },
  {
    key: "session",
    items: [
      { key: "logout", label: "Log out", section: "session" },
      { key: "danger", label: "Danger", disabled: true, section: "session" },
    ],
  },
];
