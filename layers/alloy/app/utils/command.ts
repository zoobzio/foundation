export interface FilterItem {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  key: string;
  label?: string;
  items: FilterItem[];
}

const filter = (
  groups: FilterGroup[],
  search: string,
  selected: Set<string>,
  filtered: boolean,
): FilterGroup[] => {
  if (filtered) return groups.filter((g) => g.items.length > 0);

  const term = search.toLowerCase();
  const isSearching = term.length > 0;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (isSearching && !item.label.toLowerCase().includes(term)) return false;
        if (item.count === 0 && !selected.has(item.value)) return false;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
};

export const Command = { filter };
