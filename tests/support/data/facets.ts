import type { FacetGroup } from "#foundation/types/data/filter-facets";

export const fakeFacetGroups: FacetGroup[] = [
  {
    key: "status",
    label: "Status",
    items: [
      { value: "active", label: "Active", count: 10 },
      { value: "inactive", label: "Inactive", count: 3 },
    ],
  },
];
