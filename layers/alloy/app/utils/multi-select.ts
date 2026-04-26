export interface DisplayItem {
  value: string;
  label: string;
}

const display = (items: DisplayItem[], selected: string[], placeholder: string): string => {
  if (!selected.length) return placeholder;
  if (selected.length === 1) {
    const val = selected[0]!;
    const item = items.find((i) => i.value === val);
    return item?.label ?? val;
  }
  return `${selected.length} selected`;
};

const toggle = (selected: string[], value: string): string[] =>
  selected.includes(value)
    ? selected.filter((v) => v !== value)
    : [...selected, value];

export const MultiSelect = { display, toggle };
