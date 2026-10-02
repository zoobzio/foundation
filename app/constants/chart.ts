// data/chart constants

import type { ChartControlSlots } from "../types/data/chart/control";

// Control slots the widget relays that share the control ctx. The
// item-scoped `controlOptionIcon` is relayed explicitly.
export const CHART_CONTROL_SLOTS = [
  "controlTitleIcon",
  "controlIcon",
] as const satisfies readonly (keyof ChartControlSlots<unknown>)[];

// Default palette
export const PALETTE = [
  "hsl(210, 80%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 50%)",
  "hsl(270, 60%, 55%)",
  "hsl(20, 85%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(300, 50%, 55%)",
];

export const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
} as const;

// Variant label for title
export const VARIANT_LABELS: Record<string, string> = {
  breakdown: "Breakdown",
  series: "Series",
  distribution: "Distribution",
  comparison: "Comparison",
};

// Toolbar control fab labels per selector kind
export const CHART_FIELD_LABEL = "Field";
export const CHART_GROUP_BY_LABEL = "Group by";
export const CHART_BUCKET_LABEL = "Bucket";
export const CHART_X_LABEL = "X";
export const CHART_Y_LABEL = "Y";
export const CHART_RENDERER_LABEL = "Chart type";
export const CHART_REFRESH_LABEL = "Refresh";

// Fallback slice color when the palette index is out of range
export const CHART_FALLBACK_COLOR = "hsl(0, 0%, 60%)";
