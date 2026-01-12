import { search, buildSearchIndex } from "../utils/search";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = String(query.q || "");
  const limit = Number(query.limit) || 20;

  // Ensure index is built (lazy init on first request)
  await buildSearchIndex(async (collection) => {
    return await queryCollectionSearchSections(event, collection, {
      ignoredTags: ["pre", "code"],
    });
  });

  const results = search(q, limit);

  return {
    query: q,
    results,
  };
});
