import type {
  CommandGroup,
  CommandOption,
} from "../../src/types/components/command";

/**
 * Two groups of counted options. "Archived" has a count of 0.
 */
export const fakeGroups: CommandGroup<CommandOption>[] = [
  {
    key: "fruit",
    label: "Fruit",
    options: [
      { value: "apple", label: "Apple", count: 3 },
      { value: "banana", label: "Banana", count: 1 },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active", count: 5 },
      { value: "archived", label: "Archived", count: 0 },
    ],
  },
];
