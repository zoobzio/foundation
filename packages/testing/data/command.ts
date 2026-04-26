import type { CommandGroup } from "../../../layers/alloy/app/types/command";

export const fakeCommandGroups: CommandGroup[] = [
  {
    key: "fruits",
    label: "Fruits",
    items: [
      { value: "apple", label: "Apple", count: 12 },
      { value: "banana", label: "Banana", count: 8 },
      { value: "cherry", label: "Cherry", count: 3 },
    ],
  },
];
