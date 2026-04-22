export const useFakeTable = () => {
  const table = accessFakeTable();

  const recipes: DataTableRecipes = {
    keywords: computed(() => defineKeywords({})),

    facets: computed(() =>
      defineFacets({
        groups: table.facetGroups.value,
      }),
    ),

    dateFilters: computed(() =>
      defineDateFilters({
        fields: table.dateColumns.value.map((c) => ({
          key: String(c.key),
          label: c.label,
        })),
        addFilter: table.addDateFilter,
        removeFilter: table.removeDateFilter,
      }),
    ),

    pagination: computed(() =>
      definePagination(
        {
          page: table.page.value,
          pageSize: table.pageSize.value,
          pageCount: table.pageCount.value,
          total: table.total.value,
          goToPage: table.goToPage,
        },
        { "update:pageSize": table.setPageSize },
      ),
    ),

  };

  return { table, recipes };
};
