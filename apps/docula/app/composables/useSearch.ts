import MiniSearch from "minisearch";

interface SearchSection {
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
}

export interface SearchResult {
  id: string;
  path: string;
  title: string;
  titles: string[];
  score: number;
}

export function useSearch() {
  const { collection: collectionConfig } = useAppConfig();
  const results = ref<SearchResult[]>([]);

  const collection = collectionConfig?.key ?? "content";

  const { data: sections } = useAsyncData(
    `search-sections-${collection}`,
    () => queryCollectionSearchSections(collection),
    { default: () => [] as SearchSection[] },
  );

  const sectionsById = computed(() => new Map(sections.value.map((s) => [s.id, s])));

  const miniSearch = computed(() => {
    const ms = new MiniSearch<SearchSection>({
      fields: ["title", "titles", "content"],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 4, titles: 2, content: 1 },
      },
    });

    if (sections.value.length > 0) {
      ms.addAll(sections.value);
    }

    return ms;
  });

  const search = (query: string) => {
    if (!query.trim()) {
      results.value = [];
      return;
    }

    results.value = miniSearch.value
      .search(query)
      .slice(0, 10)
      .flatMap((r) => {
        const section = sectionsById.value.get(r.id);
        if (!section) return [];
        return {
          id: section.id,
          path: section.id.split("#")[0],
          title: section.title,
          titles: section.titles,
          score: r.score,
        };
      });
  };

  return { results, search };
}
