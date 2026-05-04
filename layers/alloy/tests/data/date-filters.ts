import type { DateFilter, DateFieldConfig } from "../../app/types/date-filters";

export const fakeDateFields: DateFieldConfig[] = [
  { key: "created", label: "Created" },
  { key: "updated", label: "Updated" },
];

export const fakeDateFilter: DateFilter = {
  field: "created",
  operator: "after",
  value: new Date("2025-01-01"),
};

export const fakeDateRangeFilter: DateFilter = {
  field: "created",
  operator: "between",
  value: new Date("2025-01-01"),
  endValue: new Date("2025-06-01"),
};
