import type { DataTableSnapshot } from "../schemas/data-table";

export const defaultTableSnapshot: DataTableSnapshot = {
  query: "",
  keywords: "",
  match: "all",
  page: 1,
  pageSize: 25,
  selectedFacets: [],
  dateFilters: [],
  sortField: null,
  sortDirection: "asc",
  columnOrder: [],
};
