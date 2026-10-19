import type {
  BreakdownData,
  ChartDefaults,
  Config,
  DataChartVariant,
  SeriesVariant,
  State,
  StateKey,
} from "./types";

export const change = <T>(
  field: StateKey,
  before: State<T>[StateKey],
  after: State<T>[StateKey],
) => ({ field, before, after });

/**
 * Builds the ordered variant descriptor list from whichever variant keys the
 * config declares. Pure — shared by the state factory (default resolution)
 * and the service (its variant map).
 */
export const buildVariants = <T>(config: Config<T>): DataChartVariant<T>[] => {
  const variants: DataChartVariant<T>[] = [];
  if (config.breakdown)
    variants.push({ type: "breakdown", ...config.breakdown });
  if (config.series) variants.push({ type: "series", ...config.series });
  if (config.distribution)
    variants.push({ type: "distribution", ...config.distribution });
  if (config.comparison)
    variants.push({ type: "comparison", ...config.comparison });
  return variants;
};

/**
 * Resolves the initial active selection from the first declared variant.
 * The bucket comes from the first series variant, wherever it is declared.
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
