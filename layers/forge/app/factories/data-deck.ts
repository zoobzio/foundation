import { WIDGET_CONFIGS } from "./data-table";
import { DataDeckSnapshotSchema } from "../schemas/data-deck";
import type { DataDeckSnapshot } from "../schemas/data-deck";
import type {
  Deck,
  DataDeckConfig,
  DataDeckFetchParams,
} from "../types/data-deck";

const SORT_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  published: "Published",
  modified: "Modified",
};

function sortLabel(field: string): string {
  // Check known labels, then capitalize the field name
  return SORT_LABELS[field] ?? field.charAt(0).toUpperCase() + field.slice(1);
}

export const createDeck = <T>(
  id: string,
  config: DataDeckConfig<T>,
) => {
  return (): Deck<T> => {
    const configs = inject(WIDGET_CONFIGS, {});
    const raw = configs[id];
    const defaults = DataDeckSnapshotSchema.parse(raw ?? {});

    // Initialization
    const initialized = useState<boolean>(
      `deck-${id}-initialized`,
      () => false,
    );

    // State
    const items = useState<T[]>(`deck-${id}-items`, () => []);
    const pending = useState<T[]>(`deck-${id}-pending`, () => []);
    const loading = useState<boolean>(`deck-${id}-loading`, () => false);
    const loadingMore = useState<boolean>(
      `deck-${id}-loadingMore`,
      () => false,
    );
    const hasMore = useState<boolean>(`deck-${id}-hasMore`, () => true);

    // Sort — always newest first, consumer picks the date field
    const firstDateField = String(config.dateFields[0]?.key ?? "created");
    const sortField = useState<string>(
      `deck-${id}-sortField`,
      () => defaults.sortField || firstDateField,
    );

    // Filters
    const query = useState<string>(`deck-${id}-query`, () => defaults.query);
    const keywords = useState<string>(
      `deck-${id}-keywords`,
      () => defaults.keywords,
    );
    const match = useState<MatchMode>(
      `deck-${id}-match`,
      () => defaults.match,
    );
    const selectedFacets = useState<Set<string>>(
      `deck-${id}-selectedFacets`,
      () => new Set(defaults.selectedFacets),
    );
    const facetGroups = useState<FacetGroup[]>(
      `deck-${id}-facetGroups`,
      () => [],
    );

    // Facet changes trigger refetch
    watch(selectedFacets, () => fetchData(), { deep: true });

    // Polling
    const pollInterval = config.pollInterval ?? 30000;
    const pageSize = config.pageSize ?? 25;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    // Getters
    const title = computed(() => {
      const fieldConfig = config.dateFields.find(
        (f) => String(f.key) === sortField.value,
      );
      const label = fieldConfig?.label ?? sortLabel(sortField.value);
      return `Recently ${label} ${config.topic}`;
    });

    const pendingCount = computed(() => pending.value.length);

    // Build fetch params
    const baseParams = (): Omit<DataDeckFetchParams, "after" | "before"> => ({
      limit: pageSize,
      sortField: sortField.value,
      query: query.value,
      keywords: keywords.value,
      match: match.value,
      facets: selectedFacets.value,
    });

    // Initial fetch
    const fetchData = async () => {
      loading.value = true;
      try {
        const result = await config.fetch(baseParams());
        items.value = result.data;
        hasMore.value = result.hasMore;
        pending.value = [];
        if (result.facets) facetGroups.value = result.facets;
      } finally {
        loading.value = false;
        useNuxtApp().callHook("widget:deck:snapshot", {
          id,
          snapshot: getSnapshot(),
        });
      }
    };

    // Load more — older items
    const loadMore = async () => {
      if (loadingMore.value || !hasMore.value || !items.value.length) return;
      loadingMore.value = true;
      try {
        const oldest = items.value[items.value.length - 1]!;
        const oldestDate = String(oldest[sortField.value as keyof T]);
        const result = await config.fetch({
          ...baseParams(),
          before: oldestDate,
        });
        items.value = [...items.value, ...result.data];
        hasMore.value = result.hasMore;
        if (result.facets) facetGroups.value = result.facets;
      } finally {
        loadingMore.value = false;
      }
    };

    // Poll — newer items
    const poll = async () => {
      if (!items.value.length) return;
      const newest = items.value[0]!;
      const newestDate = String(newest[sortField.value as keyof T]);
      try {
        const result = await config.fetch({
          ...baseParams(),
          after: newestDate,
        });
        if (result.data.length) {
          pending.value = [...result.data, ...pending.value];
        }
        if (result.facets) facetGroups.value = result.facets;
      } catch {
        // Polling errors are silent — next interval will retry
      }
    };

    // Show pending — prepend buffered items
    const showPending = () => {
      items.value = [...pending.value, ...items.value];
      pending.value = [];
    };

    // Sort field
    const setSortField = (field: string) => {
      if (!config.dateFields.some((f) => String(f.key) === field)) return;
      sortField.value = field;
      fetchData();
    };

    // Polling controls
    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(poll, pollInterval);
    };

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    // Persistence
    const getSnapshot = (): DataDeckSnapshot => ({
      sortField: sortField.value,
      query: query.value,
      keywords: keywords.value,
      match: match.value,
      selectedFacets: [...selectedFacets.value],
    });

    const restoreSnapshot = (snapshot: DataDeckSnapshot) => {
      sortField.value = snapshot.sortField;
      query.value = snapshot.query;
      keywords.value = snapshot.keywords;
      match.value = snapshot.match;
      selectedFacets.value = new Set(snapshot.selectedFacets);
      fetchData();
    };

    // Init — idempotent
    const init = async () => {
      if (initialized.value) return true;
      initialized.value = true;
      await fetchData();
      return true;
    };

    return {
      items,
      pending,
      loading,
      loadingMore,
      hasMore,
      initialized,
      query,
      keywords,
      match,
      selectedFacets,
      facetGroups,
      sortField,
      topic: config.topic,
      rowKey: config.rowKey,
      dateFields: config.dateFields,
      pollInterval,
      title,
      pendingCount,
      init,
      fetch: fetchData,
      loadMore,
      showPending,
      setSortField,
      startPolling,
      stopPolling,
      getSnapshot,
      restoreSnapshot,
    };
  };
};
