export const createTable = <T, K = unknown>(
  id: string,
  config: DataTableConfig<T>,
) => {
  return (): Table<T, K> => {
    // Resolve defaults: inject pre-fetched configs, validate with zod, fall back to constants
    const configs = inject(WIDGET_CONFIGS, {});
    const raw = configs[id];
    const defaults = raw
      ? { ...defaultTableSnapshot, ...DataTableSnapshotSchema.partial().parse(raw) }
      : defaultTableSnapshot;

    // Initialization
    const initialized = useState<boolean>(`table-${id}-initialized`, () => false);

    // State
    const data = useState<T[]>(`table-${id}-data`, () => []);
    const loading = useState<boolean>(`table-${id}-loading`, () => false);
    const page = useState<number>(`table-${id}-page`, () => defaults.page);
    const pageSize = useState<number>(
      `table-${id}-pageSize`,
      () => defaults.pageSize,
    );
    const total = useState<number>(`table-${id}-total`, () => 0);
    const pageCount = useState<number>(`table-${id}-pageCount`, () => 0);
    const sortField = useState<string | null>(
      `table-${id}-sortField`,
      () => defaults.sortField,
    );
    const sortDirection = useState<SortDirection>(
      `table-${id}-sortDirection`,
      () => defaults.sortDirection,
    );
    const query = useState<string>(`table-${id}-query`, () => defaults.query);
    const keywords = useState<string>(
      `table-${id}-keywords`,
      () => defaults.keywords,
    );
    const match = useState<MatchMode>(
      `table-${id}-match`,
      () => defaults.match,
    );
    const selectedFacets = useState<Set<string>>(
      `table-${id}-selectedFacets`,
      () => new Set(defaults.selectedFacets),
    );
    const facetGroups = useState<FacetGroup[]>(
      `table-${id}-facetGroups`,
      () => [],
    );
    const dateFilters = useState<DateFilter[]>(
      `table-${id}-dateFilters`,
      () => defaults.dateFilters,
    );
    const selected = useState<Set<K>>(`table-${id}-selected`, () => new Set());

    // Static config
    const columns = config.columns;
    const rowKey = config.rowKey;
    const actions = config.actions ?? [];

    // Pagination
    const goToPage = (p: number) => {
      if (p < 1 || p > pageCount.value) return;
      page.value = p;
      fetchData();
    };

    // Sorting
    const sortBy = (field: string) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortDirection.value = "asc";
      }
      page.value = 1;
      fetchData();
    };

    // Facets
    const clearFacets = () => {
      selectedFacets.value = new Set();
      page.value = 1;
      fetchData();
    };

    // Date filters
    const addDateFilter = (filter: DateFilter) => {
      const existing = dateFilters.value.findIndex(
        (f) => f.field === filter.field,
      );
      if (existing >= 0) {
        const next = [...dateFilters.value];
        next[existing] = filter;
        dateFilters.value = next;
      } else {
        dateFilters.value = [...dateFilters.value, filter];
      }
      page.value = 1;
      fetchData();
    };

    const removeDateFilter = (field: string) => {
      dateFilters.value = dateFilters.value.filter((f) => f.field !== field);
      page.value = 1;
      fetchData();
    };

    const clearDateFilters = () => {
      dateFilters.value = [];
      page.value = 1;
      fetchData();
    };

    // Selection
    const isAllSelected = computed(() => {
      if (!data.value.length) return false;
      return data.value.every((row) =>
        selected.value.has(row[config.rowKey] as K),
      );
    });

    const isIndeterminate = computed(() => {
      if (!selected.value.size) return false;
      return !isAllSelected.value;
    });

    const toggleRow = (key: K) => {
      const next = new Set(selected.value);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      selected.value = next;
    };

    const toggleAll = () => {
      if (isAllSelected.value) {
        selected.value = new Set();
      } else {
        selected.value = new Set(
          data.value.map((row) => row[config.rowKey] as K),
        );
      }
    };

    const clearSelection = () => {
      selected.value = new Set();
    };

    // Getters
    const sortFieldFor = (col: DataTableColumn<T>) =>
      col.sortKey ?? String(col.key);
    const isSorted = (col: DataTableColumn<T>) =>
      sortField.value === sortFieldFor(col);
    const getSortIcon = (): IconAlias =>
      sortDirection.value === "asc" ? "chevron-up" : "chevron-down";
    const isRowSelected = (row: T) =>
      selected.value.has(row[config.rowKey] as K);
    const selectAllState = computed(() => {
      if (isIndeterminate.value) return "indeterminate" as const;
      return isAllSelected.value;
    });
    const colSpan = computed(() => columns.length + (actions.length ? 1 : 0));
    const dateColumns = computed(() =>
      columns.filter((c) => c.type === "date" || c.type === "datetime"),
    );

    const setPageSize = (size: number) => {
      pageSize.value = size;
      page.value = 1;
      fetchData();
    };

    // Mutation
    const update = (payload: Partial<DataTablePayload>) => {
      if (payload.query !== undefined) query.value = payload.query;
      if (payload.keywords !== undefined) keywords.value = payload.keywords;
      if (payload.match !== undefined) match.value = payload.match;
      if (payload.page !== undefined) page.value = payload.page;
      if (payload.pageSize !== undefined) pageSize.value = payload.pageSize;
      if (payload.selectedFacets !== undefined)
        selectedFacets.value = payload.selectedFacets;
      if (payload.dateFilters !== undefined)
        dateFilters.value = payload.dateFilters;
      fetchData();
    };

    // Persistence
    const getSnapshot = (): DataTableSnapshot => ({
      query: query.value,
      keywords: keywords.value,
      match: match.value,
      page: page.value,
      pageSize: pageSize.value,
      selectedFacets: [...selectedFacets.value],
      dateFilters: dateFilters.value,
      sortField: sortField.value,
      sortDirection: sortDirection.value,
    });

    const restoreSnapshot = (snapshot: DataTableSnapshot) => {
      query.value = snapshot.query;
      keywords.value = snapshot.keywords;
      match.value = snapshot.match;
      page.value = snapshot.page;
      pageSize.value = snapshot.pageSize;
      selectedFacets.value = new Set(snapshot.selectedFacets);
      dateFilters.value = snapshot.dateFilters;
      sortField.value = snapshot.sortField;
      sortDirection.value = snapshot.sortDirection;
      fetchData();
    };

    // Init — idempotent, returns true for useAsyncData
    const init = async () => {
      if (initialized.value) return true;
      initialized.value = true;
      await fetchData();
      return true;
    };

    // Fetch
    const fetchData = async () => {
      loading.value = true;
      try {
        const params: DataTableFetchParams = {
          page: page.value,
          pageSize: pageSize.value,
          sortField: sortField.value,
          sortDirection: sortDirection.value,
          query: query.value,
          keywords: keywords.value,
          match: match.value,
          facets: selectedFacets.value,
          dateFilters: dateFilters.value,
        };
        const result = await config.fetch(params);
        data.value = result.data;
        total.value = result.total;
        pageCount.value = result.pageCount;
        if (result.facets) facetGroups.value = result.facets;
      } finally {
        loading.value = false;
        useNuxtApp().callHook("widget:table:snapshot", {
          id,
          snapshot: getSnapshot(),
        });
      }
    };

    return {
      data,
      loading,
      columns,
      rowKey,
      actions,
      page,
      pageSize,
      pageCount,
      total,
      sortField,
      sortDirection,
      query,
      keywords,
      match,
      facetGroups,
      selectedFacets,
      dateFilters,
      selected,
      isAllSelected,
      isIndeterminate,
      selectAllState,
      colSpan,
      dateColumns,
      goToPage,
      sortBy,
      clearFacets,
      addDateFilter,
      removeDateFilter,
      clearDateFilters,
      toggleRow,
      toggleAll,
      clearSelection,
      sortFieldFor,
      isSorted,
      getSortIcon,
      isRowSelected,
      setPageSize,
      update,
      getSnapshot,
      restoreSnapshot,
      init,
      initialized,
      fetch: fetchData,
    };
  };
};
