import type {
  BreakdownData,
  BreakdownVariant,
  BucketSize,
  ComparisonData,
  ComparisonVariant,
  Config,
  DataChartVariant,
  DistributionData,
  DistributionVariant,
  SeriesData,
  SeriesVariant,
} from "#foundation/types/data/chart";
import type { ChartOptions as CJSChartOptions } from "chart.js";

import {
  BASE_OPTIONS,
  CHART_FALLBACK_COLOR,
  PALETTE,
} from "#foundation/constants/chart";
import {
  Chart as ChartJS,
  LineController,
  BarController,
  PieController,
  DoughnutController,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineController,
  BarController,
  PieController,
  DoughnutController,
  PolarAreaController,
  RadarController,
  ScatterController,
  BubbleController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Legend,
  Title,
  Tooltip,
);

/**
 * Builds the ordered variant descriptor list from whichever variant keys the
 * config declares. Pure — shared by the store (default resolution) and the
 * service (its variant map).
 */
export const buildVariants = <T>(config: Config<T>): DataChartVariant<T>[] => {
  const variants: DataChartVariant<T>[] = [];
  if (config.breakdown) variants.push({ type: "breakdown", ...config.breakdown });
  if (config.series) variants.push({ type: "series", ...config.series });
  if (config.distribution)
    variants.push({ type: "distribution", ...config.distribution });
  if (config.comparison)
    variants.push({ type: "comparison", ...config.comparison });
  return variants;
};

export type ChartDefaults<T> = {
  activeVariant: string;
  activeRenderer: string;
  activeField: keyof T | null;
  activeGroupBy: keyof T | null;
  activeX: keyof T | null;
  activeY: keyof T | null;
  activeBucket: BucketSize | null;
  activeRange: [Date, Date] | null;
};

/**
 * Resolves the initial active state from the first declared variant. Feeds the
 * store's `useState` initializers.
 */
export const resolveChartDefaults = <T>(
  variants: DataChartVariant<T>[],
): ChartDefaults<T> => {
  const first = variants[0];
  const series = variants.find(
    (v): v is SeriesVariant<T> => v.type === "series",
  );
  return {
    activeVariant: first?.type ?? "",
    activeRenderer: first?.renderers[0]?.type ?? "",
    activeField: first?.fields[0] ?? null,
    activeGroupBy: first?.fields[1] ?? null,
    activeX: first?.fields[0] ?? null,
    activeY: first?.fields[1] ?? null,
    activeBucket: series?.buckets[0] ?? null,
    activeRange: first && "defaultRange" in first ? first.defaultRange : null,
  };
};

/**
 * Collapses a breakdown to its top-N slices plus an aggregated "Other". Pure
 * post-processing on the breakdown action's result.
 */
export const aggregateBreakdown = (
  data: BreakdownData,
  limit?: number,
): BreakdownData => {
  if (!limit || data.labels.length <= limit) return data;

  const pairs = data.labels.map((label, i) => ({
    label,
    value: data.values[i] ?? 0,
  }));
  pairs.sort((a, b) => b.value - a.value);

  const top = pairs.slice(0, limit);
  const rest = pairs.slice(limit);
  const otherSum = rest.reduce((sum, p) => sum + p.value, 0);

  return {
    labels: [...top.map((p) => p.label), "Other"],
    values: [...top.map((p) => p.value), otherSum],
  };
};

// ---------------------------------------------------------------------------
// Color resolution — resolves CSS var() tokens to computed values for canvas.
// DOM-bound: called only from the render helpers below, never the service.
// ---------------------------------------------------------------------------

const resolveColor = (value: string): string => {
  if (!value.startsWith("var(")) return value;
  const prop = value.slice(4, -1).trim();
  return (
    getComputedStyle(document.documentElement).getPropertyValue(prop).trim() ||
    value
  );
};

const resolveColors = (
  labels: string[],
  colorMap?: Record<string, string>,
): string[] =>
  labels.map((label, i) => {
    const mapped = colorMap?.[label];
    return mapped
      ? resolveColor(mapped)
      : (PALETTE[i % PALETTE.length] ?? CHART_FALLBACK_COLOR);
  });

const mergeOptions = (renderer: { options?: object }): CJSChartOptions => ({
  ...BASE_OPTIONS,
  ...renderer.options,
});

// ---------------------------------------------------------------------------
// Narrowed renderers — one per variant shape. Own the chart.js instance
// construction; `useChartCanvas` calls them and manages the instance lifecycle.
// ---------------------------------------------------------------------------

export const renderBreakdown = <T>(
  el: HTMLCanvasElement,
  variant: BreakdownVariant<T>,
  data: BreakdownData,
  rendererType: string,
  colorMap?: Record<string, string>,
): ChartJS | null => {
  const renderer =
    variant.renderers.find((r) => r.type === rendererType) ??
    variant.renderers[0];
  if (!renderer) return null;

  const colors = resolveColors(data.labels, colorMap);
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      labels: data.labels,
      datasets: [{ data: data.values, backgroundColor: colors, borderWidth: 0 }],
    },
    options: mergeOptions(renderer),
  });
};

export const renderSeries = <T>(
  el: HTMLCanvasElement,
  variant: SeriesVariant<T>,
  data: SeriesData,
  rendererType: string,
  colorMap?: Record<string, string>,
): ChartJS | null => {
  const renderer =
    variant.renderers.find((r) => r.type === rendererType) ??
    variant.renderers[0];
  if (!renderer) return null;

  const colors = resolveColors(
    data.datasets.map((ds) => ds.label),
    colorMap,
  );
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: colors[i],
        backgroundColor: colors[i],
      })),
    },
    options: mergeOptions(renderer),
  });
};

export const renderDistribution = <T>(
  el: HTMLCanvasElement,
  variant: DistributionVariant<T>,
  data: DistributionData,
  rendererType: string,
  colorMap?: Record<string, string>,
): ChartJS | null => {
  const renderer =
    variant.renderers.find((r) => r.type === rendererType) ??
    variant.renderers[0];
  if (!renderer) return null;

  const colors = resolveColors(
    data.datasets.map((ds) => ds.label),
    colorMap,
  );
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      datasets: data.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: colors[i],
        backgroundColor: colors[i],
      })),
    },
    options: mergeOptions(renderer),
  });
};

export const renderComparison = <T>(
  el: HTMLCanvasElement,
  variant: ComparisonVariant<T>,
  data: ComparisonData,
  rendererType: string,
  colorMap?: Record<string, string>,
): ChartJS | null => {
  const renderer =
    variant.renderers.find((r) => r.type === rendererType) ??
    variant.renderers[0];
  if (!renderer) return null;

  const colors = resolveColors(
    data.datasets.map((ds) => ds.label),
    colorMap,
  );
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: colors[i],
        backgroundColor: colors[i],
      })),
    },
    options: mergeOptions(renderer),
  });
};
