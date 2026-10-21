import type { LinkTarget, Option } from "../../src/types/common";

/**
 * Plain options.
 */
export const fakeOptions: Option[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

/**
 * Options with one disabled entry.
 */
export const fakeOptionsWithDisabled: Option[] = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled", disabled: true },
  { value: "pending", label: "Pending" },
];

/**
 * Options with linked entries and one plain entry.
 */
export const fakeLinkedOptions: (Option & { link?: LinkTarget })[] = [
  { value: "overview", label: "Overview", link: { to: "/overview" } },
  { value: "activity", label: "Activity", link: { to: "/activity" } },
  {
    value: "billing",
    label: "Billing",
    disabled: true,
    link: { to: "/billing" },
  },
  { value: "local", label: "Local" },
];
