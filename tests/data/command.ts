import type { CommandGroup, CommandOption } from "#foundation/types/core/command";

export const fakeCommandGroups: CommandGroup<CommandOption>[] = [
  {
    key: "fruits",
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple", count: 12 },
      { value: "banana", label: "Banana", count: 8 },
      { value: "cherry", label: "Cherry", count: 3 },
    ],
  },
];
