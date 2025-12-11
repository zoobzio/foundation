import type { Collections } from "@nuxt/content";

export interface CollectionConfig {
  key: keyof Collections;
  basePath: string;
  icon?: string;
  title?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  titles: string[];
  content: string;
  score: number;
  collection: string;
  published?: Date;
}

export interface RecentResult {
  id: string;
  title: string;
  titles: string[];
  collection: string;
  published?: Date;
}

export interface GroupedResults {
  collection: string;
  title?: string;
  icon?: string;
  basePath: string;
  results: Array<SearchResult & { basePath: string; icon?: string }>;
}

export const useContentSearch = (collections: CollectionConfig[]) => {
  const query = ref("");
  const results = ref<SearchResult[]>([]);
  const recentResults = ref<RecentResult[]>([]);
  const isSearching = ref(false);
  const isLoadingRecent = ref(false);

  // Fetch recent articles on init
  const fetchRecent = async () => {
    isLoadingRecent.value = true;
    try {
      const response = await $fetch<{ results: RecentResult[] }>("/api/recent", {
        query: { limit: 20 },
      });
      recentResults.value = response.results;
    } catch (error) {
      console.error("[search] Failed to fetch recent:", error);
      recentResults.value = [];
    } finally {
      isLoadingRecent.value = false;
    }
  };

  // Fetch recent on mount
  onMounted(() => {
    fetchRecent();
  });

  // Debounced search
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  watch(query, (q) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!q.trim()) {
      results.value = [];
      return;
    }

    isSearching.value = true;

    searchTimeout = setTimeout(async () => {
      try {
        const response = await $fetch<{ results: SearchResult[] }>("/api/search", {
          query: { q, limit: 50 },
        });
        results.value = response.results;
      } catch (error) {
        console.error("[search] API error:", error);
        results.value = [];
      } finally {
        isSearching.value = false;
      }
    }, 150);
  });

  // Convert recent results to SearchResult format for grouping
  const recentAsSearchResults = computed<SearchResult[]>(() => {
    return recentResults.value.map((r) => ({
      id: r.id,
      title: r.title,
      titles: r.titles,
      content: "",
      score: 0,
      collection: r.collection,
      published: r.published,
    }));
  });

  // Group results by collection
  // Show search results only when we have a query AND results have loaded (not searching)
  // Otherwise show recent results
  const groupedResults = computed<GroupedResults[]>(() => {
    const hasQuery = query.value.trim().length > 0;
    const hasSearchResults = results.value.length > 0;

    // Use search results only when query exists and we're not still searching
    // OR when query exists and we have results (even if still searching for refinements)
    const useSearchResults = hasQuery && (hasSearchResults || !isSearching.value);

    const sourceResults = useSearchResults
      ? results.value
      : recentAsSearchResults.value;

    const groups = new Map<string, GroupedResults>();

    for (const result of sourceResults) {
      if (!groups.has(result.collection)) {
        const config = collections.find((c) => c.key === result.collection);
        groups.set(result.collection, {
          collection: result.collection,
          title: config?.title,
          icon: config?.icon,
          basePath: config?.basePath || `/${result.collection}`,
          results: [],
        });
      }

      const group = groups.get(result.collection)!;
      const config = collections.find((c) => c.key === result.collection);

      group.results.push({
        ...result,
        basePath: config?.basePath || `/${result.collection}`,
        icon: config?.icon,
      });
    }

    return Array.from(groups.values());
  });

  return {
    query,
    results: readonly(results),
    recentResults: readonly(recentResults),
    groupedResults: readonly(groupedResults),
    isSearching: readonly(isSearching),
    isLoadingRecent: readonly(isLoadingRecent),
    fetchRecent,
  };
};
