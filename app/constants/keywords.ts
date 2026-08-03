// core/keywords constants
import type { IconAlias } from "#foundation/types/common/iconic";
import type { Option } from "#foundation/types/core/common";

export const MATCH_OPTIONS: Option[] = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

export const KEYWORDS_TRIGGER_ICON: IconAlias = "tag";
export const KEYWORDS_INCLUDE_PLACEHOLDER = "Add keyword...";
export const KEYWORDS_EXCLUDE_PLACEHOLDER = "Exclude keyword...";
