import type { VariantData } from "@zoobzio/chart";

/**
 * The chart domain contract lives in the headless `@zoobzio/chart` package.
 * Re-exported here so layer modules and consumers keep one import path. A
 * renderer's `options` is `object` on the machine; the layer's render
 * helpers (`utils/chart.ts`) narrow it to chart.js options.
 */
export type {
  Actions,
  BreakdownConfig,
  BreakdownData,
  BreakdownFetchParams,
  BreakdownRenderer,
  BreakdownVariant,
  BucketSize,
  Change,
  Changes,
  ChartDefaults,
  ComparisonConfig,
  ComparisonData,
  ComparisonFetchParams,
  ComparisonRenderer,
  ComparisonVariant,
  Config,
  DataChartVariant,
  DistributionConfig,
  DistributionData,
  DistributionDataset,
  DistributionFetchParams,
  DistributionPoint,
  DistributionRenderer,
  DistributionVariant,
  Event,
  Listener,
  Middleware,
  Options,
  RendererConfig,
  SeriesConfig,
  SeriesData,
  SeriesDataset,
  SeriesFetchParams,
  SeriesRenderer,
  SeriesVariant,
  Service,
  State,
  StateKey,
  VariantData,
} from "@zoobzio/chart";

export type { Events as ServiceEvents } from "@zoobzio/chart";

/**
 * The Nuxt hook map of a chart: the service's domain events, prefixed and
 * id-scoped, as `useChart` relays them onto the app hook bus.
 */
export type Events = {
  "chart:updated": (event: {
    id: string;
    variant: string;
    data: VariantData | null;
  }) => void;
  "chart:variant-changed": (event: { id: string; variant: string }) => void;
  "chart:renderer-changed": (event: { id: string; renderer: string }) => void;
};
