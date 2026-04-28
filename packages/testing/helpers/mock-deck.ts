import { ref, computed } from "vue";
import { vi } from "vitest";
import type { Deck, DateFieldConfig } from "../../../layers/forge/app/types/data-deck";

export interface MockDeckOptions<T> {
  topic?: string;
  rowKey?: keyof T;
  dateFields?: DateFieldConfig<T>[];
  items?: T[];
}

/**
 * Creates a mock Deck<T> with reactive refs and vi.fn() stubs for all methods.
 */
export const createMockDeck = <T>(options: MockDeckOptions<T> = {}): Deck<T> => {
  const {
    topic = "Test",
    rowKey = "id" as keyof T,
    dateFields = [{ key: "created" as keyof T, label: "Created" }],
    items: initialItems = [],
  } = options;

  const sortField = ref(String(dateFields[0]?.key ?? "created"));

  return {
    items: ref(initialItems) as Deck<T>["items"],
    pending: ref([]) as Deck<T>["pending"],
    loading: ref(false),
    loadingMore: ref(false),
    hasMore: ref(true),
    initialized: ref(true),
    query: ref(""),
    keywords: ref(""),
    match: ref("all") as Deck<T>["match"],
    selectedFacets: ref(new Set<string>()) as Deck<T>["selectedFacets"],
    facetGroups: ref([]) as Deck<T>["facetGroups"],
    sortField,
    topic,
    rowKey,
    dateFields,
    pollInterval: 30000,
    title: computed(() => `Recently Created ${topic}`),
    pendingCount: computed(() => 0),
    init: vi.fn(async () => true),
    fetch: vi.fn(async () => {}),
    loadMore: vi.fn(async () => {}),
    showPending: vi.fn(),
    setSortField: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    getSnapshot: vi.fn(() => ({
      sortField: sortField.value,
      query: "",
      keywords: "",
      match: "all" as const,
      selectedFacets: [],
    })),
    restoreSnapshot: vi.fn(),
  };
};
