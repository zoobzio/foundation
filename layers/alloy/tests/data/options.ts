import type { Option } from "../../app/types/common";

export const fakeOptions: Option[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export const fakeOptionsWithIcons: Option[] = [
  { value: "home", label: "Home", icon: "home" },
  { value: "settings", label: "Settings", icon: "settings" },
  { value: "user", label: "User", icon: "user" },
];

export const fakeOptionsWithDisabled: Option[] = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled", disabled: true },
  { value: "pending", label: "Pending" },
];
