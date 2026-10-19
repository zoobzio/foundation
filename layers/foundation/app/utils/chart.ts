import type {
  BreakdownData,
  BreakdownVariant,
  ComparisonData,
  ComparisonVariant,
  DistributionData,
  DistributionVariant,
  SeriesData,
  SeriesVariant,
} from "../types/data/chart";
import type { ChartOptions as CJSChartOptions } from "chart.js";

import {
  BASE_OPTIONS,
  CHART_FALLBACK_COLOR,
  PALETTE,
} from "../constants/chart";
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
      datasets: [
        { data: data.values, backgroundColor: colors, borderWidth: 0 },
      ],
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
