import type { PageCollections } from "@nuxt/content";

export const useContentTreeState = (collection: keyof PageCollections) => {
  const route = useRoute();

  // Persisted expanded state per collection
  const expanded = useState<string[]>(`content-tree-expanded-${String(collection)}`, () => []);

  // Get all ancestor paths for a given path
  // e.g., "/foo/bar/baz" -> ["/foo", "/foo/bar"]
  const getAncestorPaths = (path: string): string[] => {
    const collectionPrefix = `/${String(collection)}`;
    // Remove collection prefix to get the content path
    const contentPath = path.startsWith(collectionPrefix)
      ? path.slice(collectionPrefix.length)
      : path;

    const segments = contentPath.split("/").filter(Boolean);
    const ancestors: string[] = [];

    for (let i = 1; i < segments.length; i++) {
      ancestors.push("/" + segments.slice(0, i).join("/"));
    }

    return ancestors;
  };

  // Auto-expand to current route on initial load
  const initializeExpanded = () => {
    const ancestors = getAncestorPaths(route.path);
    if (ancestors.length > 0) {
      // Merge with existing expanded, avoiding duplicates
      const newExpanded = new Set([...expanded.value, ...ancestors]);
      expanded.value = Array.from(newExpanded);
    }
  };

  // Handle expansion updates from Tree component
  const handleExpandedUpdate = (value: string[]) => {
    expanded.value = value;
  };

  // Initialize on first use
  if (import.meta.client && expanded.value.length === 0) {
    initializeExpanded();
  }

  // Watch route changes to ensure current path ancestors are expanded
  watch(
    () => route.path,
    (newPath) => {
      const ancestors = getAncestorPaths(newPath);
      if (ancestors.length > 0) {
        const newExpanded = new Set([...expanded.value, ...ancestors]);
        expanded.value = Array.from(newExpanded);
      }
    },
  );

  return {
    expanded,
    handleExpandedUpdate,
  };
};
