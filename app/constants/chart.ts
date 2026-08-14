// data/chart constants

import type { IconAlias } from "../types/common/iconic";

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

// Renderer type → toolbar icon
export const RENDERER_ICONS: Record<string, IconAlias> = {
  pie: "pie-chart",
  doughnut: "doughnut-chart",
  polarArea: "polar-chart",
  bar: "bar-chart",
  line: "show-chart",
  radar: "radar-chart",
  scatter: "scatter-chart",
  bubble: "bubble-chart",
};

// Fallback renderer icon when the active renderer has no mapping
export const RENDERER_FALLBACK_ICON: IconAlias = "bar-chart";

// Chevron on the variant (title) selector trigger
export const CHART_CONTROL_CHEVRON: IconAlias = "chevron-down";

// Toolbar control icons per selector kind
export const CHART_FIELD_ICON: IconAlias = "layers";
export const CHART_GROUP_BY_ICON: IconAlias = "filter";
export const CHART_BUCKET_ICON: IconAlias = "schedule";
export const CHART_X_ICON: IconAlias = "arrow-right";
export const CHART_Y_ICON: IconAlias = "arrow-up";
export const CHART_REFRESH_ICON: IconAlias = "refresh";

// Fallback slice color when the palette index is out of range
export const CHART_FALLBACK_COLOR = "hsl(0, 0%, 60%)";
