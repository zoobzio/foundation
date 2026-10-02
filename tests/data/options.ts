import type { LinkTarget, Option } from "../../app/types/core/common";

export const fakeOptions: Option[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export const fakeOptionsWithDisabled: Option[] = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled", disabled: true },
  { value: "pending", label: "Pending" },
];

/** Mixed options: linked entries navigate, the plain entry only emits. */
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
