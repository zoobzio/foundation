import type { Config, MatchMode, State } from "../types/data/deck";
import type { FacetGroup } from "../types/core/facets";

import { useState } from "#imports";
import { DECK_DEFAULT_MATCH_MODE } from "../constants/deck";

export const accessDeck = <T>(id: string, config: Config<T>): State<T> => {
  // Sort defaults to the first declared date field.
  const firstDateField = String(config.dateFields[0]?.key ?? "created");

  const items = useState<T[]>(`deck-${id}-items`, () => []);
  const pending = useState<T[]>(`deck-${id}-pending`, () => []);
  const loading = useState<boolean>(`deck-${id}-loading`, () => false);
  const loadingMore = useState<boolean>(`deck-${id}-loadingMore`, () => false);
  const hasMore = useState<boolean>(`deck-${id}-hasMore`, () => true);
  const initialized = useState<boolean>(`deck-${id}-initialized`, () => false);

  const query = useState<string>(`deck-${id}-query`, () => "");
  const keywords = useState<string>(`deck-${id}-keywords`, () => "");
  const match = useState<MatchMode>(
    `deck-${id}-match`,
    () => DECK_DEFAULT_MATCH_MODE,
  );
  const selectedFacets = useState<Set<string>>(
    `deck-${id}-selectedFacets`,
    () => new Set(),
  );
  const facetGroups = useState<FacetGroup[]>(
    `deck-${id}-facetGroups`,
    () => [],
  );
  const sortField = useState<string>(
    `deck-${id}-sortField`,
    () => firstDateField,
  );

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
  };
};
