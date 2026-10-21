import type { Option } from "../types/common";

/**
 * Default label of the facets trigger.
 */
export const FACETS_TRIGGER_LABEL = "Filters";

/**
 * Default placeholder of the facets search input.
 */
export const FACETS_PLACEHOLDER = "Search filters...";

/**
 * The keyword match modes.
 */
export const MATCH_OPTIONS: Option[] = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

/**
 * Default label of the keywords trigger.
 */
export const KEYWORDS_TRIGGER_LABEL = "Keywords";

/**
 * Default placeholder of the keywords include input.
 */
export const KEYWORDS_INCLUDE_PLACEHOLDER = "Add keyword...";

/**
 * Default placeholder of the keywords exclude input.
 */
export const KEYWORDS_EXCLUDE_PLACEHOLDER = "Exclude keyword...";
