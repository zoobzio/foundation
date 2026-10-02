import type { Option } from "../../app/types/core/common";

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
