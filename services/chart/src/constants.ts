import type { StateKey } from "./types";

/** Title label of each variant type; an unknown type shows its own name. */
export const CHART_VARIANT_LABELS: Record<string, string> = {
  breakdown: "Breakdown",
  series: "Series",
  distribution: "Distribution",
  comparison: "Comparison",
};

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const CHART_STATE_FIELDS: Record<StateKey, null> = {
  initialized: null,
  loading: null,
  variantData: null,
  activeVariant: null,
  activeRenderer: null,
  activeField: null,
  activeGroupBy: null,
  activeX: null,
  activeY: null,
  activeBucket: null,
  activeRange: null,
};
