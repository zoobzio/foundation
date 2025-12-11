export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit) || 10;

  const appConfig = useAppConfig();
  const collections = (appConfig.collections || []).map((c: { key: string }) => c.key);
  const results: Array<{
    id: string;
    title: string;
    titles: string[];
    collection: string;
    published?: Date;
  }> = [];

  for (const collection of collections) {
    try {
      const items = await queryCollection(event, collection)
        .order("published", "DESC")
        .limit(limit)
        .all();

      for (const item of items) {
        const path = item.path || item.stem || "";
        // Build titles array from path segments, capitalizing each
        // e.g., "/capitan/cookbook/audit-logging" -> ["Capitan", "Cookbook", "Audit Logging"]
        const pathSegments = path
          .split("/")
          .filter(Boolean)
          .map((segment) =>
            segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          );

        // Use the article title as the last segment
        const titles =
          pathSegments.length > 1
            ? [...pathSegments.slice(0, -1), item.title || pathSegments.at(-1) || "Untitled"]
            : [item.title || "Untitled"];

        results.push({
          id: path,
          title: item.title || "Untitled",
          titles,
          collection,
          published: item.published,
        });
      }
    } catch (error) {
      console.error(`[recent] Failed to fetch from "${collection}":`, error);
    }
  }

  // Sort all results by published date descending
  results.sort((a, b) => {
    if (!a.published && !b.published) return 0;
    if (!a.published) return 1;
    if (!b.published) return -1;
    return new Date(b.published).getTime() - new Date(a.published).getTime();
  });

  return {
    results: results.slice(0, limit),
  };
});
