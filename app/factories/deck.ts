import type { Deck, Config, Actions } from "#foundation/types/data/deck";

import { accessDeck } from "#foundation/stores/deck";
import { computed, useNuxtApp } from "#imports";
import { DeckService } from "#foundation/services/deck";

export const createDeck = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
) => {
  return (): Deck<T> => {
    const nuxt = useNuxtApp();
    const state = accessDeck(id, config);
    const service = new DeckService(nuxt, id, config, state, actions);
    return {
      id,
      config,

      items: computed(() => service.items),
      pending: computed(() => service.pending),
      loading: computed(() => service.loading),
      loadingMore: computed(() => service.loadingMore),
      hasMore: computed(() => service.hasMore),
      initialized: computed(() => service.initialized),
      facetGroups: computed(() => service.facetGroups),

      // Filter state the toolbar edits — writable computeds routing through
      // the service's mutators (each fetches on write).
      query: computed({
        get: () => service.query,
        set: (v) => service.setQuery(v),
      }),
      keywords: computed({
        get: () => service.keywords,
        set: (v) => service.setKeywords(v),
      }),
      match: computed({
        get: () => service.match,
        set: (v) => service.setMatch(v),
      }),
      selectedFacets: computed({
        get: () => service.selectedFacets,
        set: (v) => service.setFacets(v),
      }),
      sortField: computed({
        get: () => service.sortField,
        set: (v) => service.setSortField(v),
      }),

      topic: service.topic,
      rowKey: service.rowKey,
      dateFields: service.dateFields,
      pollInterval: service.pollInterval,

      title: computed(() => service.title),
      pendingCount: computed(() => service.pendingCount),

      init: () => service.init(),
      fetch: () => service.fetch(),
      loadMore: () => service.loadMore(),
      poll: () => service.poll(),
      showPending: () => service.showPending(),
    };
  };
};
