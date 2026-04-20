import type { DataTableState } from "../types/data-table";

export const useTable = <T, K = unknown>(store: WidgetStore<DataTableState<T, K>>) => {
  const refs = storeToRefs(store);

  // Recipes
  const keywordsRecipe = computed(() => defineKeywords({}));

  const facetsRecipe = computed(() => defineFacets({
    groups: store.facetGroups,
  }));

  const dateFiltersRecipe = computed(() => defineDateFilters({
    fields: store.dateFields,
    addFilter: store.addDateFilter,
    removeFilter: store.removeDateFilter,
  }));

  const paginationRecipe = computed(() => definePagination(
    {
      page: store.page,
      pageSize: store.pageSize,
      pageCount: store.pageCount,
      total: store.total,
      goToPage: store.goToPage,
    },
    { "update:pageSize": store.setPageSize },
  ));

  const selectAllRecipe = computed(() => defineCheckbox({}));

  return {
    ...refs,
    keywordsRecipe,
    facetsRecipe,
    dateFiltersRecipe,
    paginationRecipe,
    selectAllRecipe,
  };
};
