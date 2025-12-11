import MiniSearch from "minisearch";

export interface SearchDocument {
  id: string;
  title: string;
  titles: string;
  content: string;
  collection: string;
}

export interface SearchResult {
  id: string;
  title: string;
  titles: string[];
  content: string;
  score: number;
  collection: string;
}

interface SearchSection {
  id: string;
  title: string;
  titles: string[];
  content: string;
}

let searchIndex: MiniSearch<SearchDocument> | null = null;
let indexReady = false;
let indexPromise: Promise<void> | null = null;

export function isSearchReady() {
  return indexReady;
}

export async function buildSearchIndex(
  fetchSections: (collection: string) => Promise<SearchSection[]>
) {
  if (indexReady) return;
  if (indexPromise) {
    await indexPromise;
    return;
  }

  indexPromise = (async () => {
    console.log("[search] Initializing search index...");

    searchIndex = new MiniSearch<SearchDocument>({
      fields: ["title", "titles", "content"],
      storeFields: ["title", "titles", "content", "collection"],
      searchOptions: {
        boost: { title: 3, titles: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    const appConfig = useAppConfig();
    const collections = (appConfig.collections || []).map((c: { key: string }) => c.key);

    for (const collection of collections) {
      try {
        const sections = await fetchSections(collection);

        // Deduplicate sections by ID to avoid MiniSearch duplicate ID errors
        const seenIds = new Set<string>();
        const documents: SearchDocument[] = [];

        for (let index = 0; index < sections.length; index++) {
          const section = sections[index];
          let docId = `${collection}::${section.id || String(index)}`;

          // If we've seen this ID, append the index to make it unique
          if (seenIds.has(docId)) {
            docId = `${collection}::${section.id || "section"}-${index}`;
          }

          seenIds.add(docId);
          documents.push({
            id: docId,
            title: section.title,
            titles: section.titles.join(" > "),
            content: section.content,
            collection,
          });
        }

        searchIndex.addAll(documents);
        console.log(`[search] Indexed ${documents.length} sections from "${collection}"`);
      } catch (error) {
        console.error(`[search] Failed to index collection "${collection}":`, error);
      }
    }

    indexReady = true;
    console.log("[search] Search index ready");
  })();

  await indexPromise;
}

export function search(query: string, limit = 20): SearchResult[] {
  if (!searchIndex || !indexReady) {
    return [];
  }

  if (!query.trim()) {
    return [];
  }

  const results = searchIndex.search(query, { limit });

  return results.map((result) => ({
    id: result.id.split("::")[1] || result.id,
    title: result.title,
    titles: result.titles.split(" > ").filter(Boolean),
    content: result.content,
    score: result.score,
    collection: result.collection,
  }));
}
