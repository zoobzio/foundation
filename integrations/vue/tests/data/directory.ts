import type {
  DirectoryGroup,
  DirectoryItem,
} from "../../src/types/core/directory";

/**
 * A directory item with a consumer field.
 */
export type FakeEntry = DirectoryItem & { section: string };

/**
 * Groups with linked, plain, and disabled items.
 */
export const fakeDirectoryGroups: DirectoryGroup<FakeEntry>[] = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      {
        key: "home",
        label: "Home",
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
