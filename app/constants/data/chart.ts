// data/chart constants

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
