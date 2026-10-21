// filter constants
import type { Option } from "../types/common";

export const FACETS_TRIGGER_LABEL = "Filters";
export const FACETS_PLACEHOLDER = "Search filters...";

export const MATCH_OPTIONS: Option[] = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

export const KEYWORDS_TRIGGER_LABEL = "Keywords";
export const KEYWORDS_INCLUDE_PLACEHOLDER = "Add keyword...";
export const KEYWORDS_EXCLUDE_PLACEHOLDER = "Exclude keyword...";
