import type { ChartType as CJSChartType, ChartOptions as CJSChartOptions } from "chart.js";

// ---------------------------------------------------------------------------
// Variant data shapes
// ---------------------------------------------------------------------------

export interface BreakdownData {
  labels: string[];
  values: number[];
}

export interface SeriesDataset {
  label: string;
  data: number[];
}

export interface SeriesData {
  labels: string[];
  datasets: SeriesDataset[];
}

export interface DistributionPoint {
  x: number;
  y: number;
  r?: number;
}

export interface DistributionDataset {
  label: string;
  data: DistributionPoint[];
}

export interface DistributionData {
  datasets: DistributionDataset[];
}

export type VariantData = BreakdownData | SeriesData | DistributionData;

// ---------------------------------------------------------------------------
// Variant → renderer mapping
// ---------------------------------------------------------------------------

export type BreakdownRenderer = "pie" | "doughnut" | "polarArea" | "bar";
export type SeriesRenderer = "line" | "bar" | "radar";
export type DistributionRenderer = "scatter" | "bubble";

// ---------------------------------------------------------------------------
// Bucket sizes for series time grouping
// ---------------------------------------------------------------------------

export type BucketSize = "1h" | "1d" | "1w" | "1mo";

// ---------------------------------------------------------------------------
// Renderer config — typed to chart.js options per chart type
// ---------------------------------------------------------------------------

export interface RendererConfig<T extends CJSChartType = CJSChartType> {
  type: T;
  label?: string;
  icon?: IconAlias;
  options?: CJSChartOptions<T>;
}

// ---------------------------------------------------------------------------
// Fetch params — per variant type, generic over T
// ---------------------------------------------------------------------------

export interface DataChartQueryParams {
  query: string;
  keywords: string;
  match: MatchMode;
  facets: Set<string>;
  dateFilters: DateFilter[];
}

export interface BreakdownFetchParams<T> {
  field: keyof T;
  query: DataChartQueryParams;
}

export interface SeriesFetchParams<T> {
  field: keyof T;
  bucket: BucketSize;
  range: [Date, Date];
  query: DataChartQueryParams;
}

export interface DistributionFetchParams<T> {
  x: keyof T;
  y: keyof T;
  range: [Date, Date];
  query: DataChartQueryParams;
}

// ---------------------------------------------------------------------------
// Variant configs (discriminated union, generic over T)
// ---------------------------------------------------------------------------

interface VariantBase<T> {
  fields: (keyof T)[];
  renderers: RendererConfig[];
}

export interface BreakdownVariant<T> extends VariantBase<T> {
  type: "breakdown";
  fetch: (params: BreakdownFetchParams<T>) => Promise<BreakdownData>;
}

export interface SeriesVariant<T> extends VariantBase<T> {
  type: "series";
  buckets: BucketSize[];
  defaultRange: [Date, Date];
  fetch: (params: SeriesFetchParams<T>) => Promise<SeriesData>;
}

export interface DistributionVariant<T> extends VariantBase<T> {
  type: "distribution";
  defaultRange: [Date, Date];
  fetch: (params: DistributionFetchParams<T>) => Promise<DistributionData>;
}

export type DataChartVariant<T> =
  | BreakdownVariant<T>
  | SeriesVariant<T>
  | DistributionVariant<T>;

// ---------------------------------------------------------------------------
// Variant config shapes — what the consumer provides (without the type disc.)
// ---------------------------------------------------------------------------

export interface BreakdownConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<BreakdownRenderer>[];
  fetch: (params: BreakdownFetchParams<T>) => Promise<BreakdownData>;
}

export interface SeriesConfig<T> {
  fields: (keyof T)[];
  buckets: BucketSize[];
  defaultRange: [Date, Date];
  renderers: RendererConfig<SeriesRenderer>[];
  fetch: (params: SeriesFetchParams<T>) => Promise<SeriesData>;
}

export interface DistributionConfig<T> {
  fields: (keyof T)[];
  defaultRange: [Date, Date];
  renderers: RendererConfig<DistributionRenderer>[];
  fetch: (params: DistributionFetchParams<T>) => Promise<DistributionData>;
}

// ---------------------------------------------------------------------------
// Config the consumer provides to the factory
// ---------------------------------------------------------------------------

export interface DataChartConfig<T> {
  topic: string;
  params: () => DataChartQueryParams;
  breakdown?: BreakdownConfig<T>;
  series?: SeriesConfig<T>;
  distribution?: DistributionConfig<T>;
}

// ---------------------------------------------------------------------------
// Reactive state interface — returned by the factory
// ---------------------------------------------------------------------------

export interface Chart<T> {
  // Canvas binding
  canvas: Ref<HTMLCanvasElement | null>;

  // Reactive state
  loading: Ref<boolean>;
  initialized: Ref<boolean>;
  activeVariant: Ref<string>;
  activeRenderer: Ref<string>;
  activeField: Ref<keyof T | null>;
  activeX: Ref<keyof T | null>;
  activeY: Ref<keyof T | null>;
  activeBucket: Ref<BucketSize | null>;
  activeRange: Ref<[Date, Date] | null>;
  variantData: Ref<VariantData | null>;

  // Static config
  readonly topic: string;
  readonly variants: DataChartVariant<T>[];

  // Getters
  activeVariantConfig: ComputedRef<DataChartVariant<T>>;
  title: ComputedRef<string>;

  // Actions
  setVariant: (type: string) => void;
  setRenderer: (type: string) => void;
  setField: (field: keyof T) => void;
  setX: (field: keyof T) => void;
  setY: (field: keyof T) => void;
  setBucket: (bucket: BucketSize) => void;
  setRange: (range: [Date, Date]) => void;
  fetch: () => Promise<void>;
  init: () => Promise<boolean>;
  getSnapshot: () => DataChartSnapshot;
  restoreSnapshot: (snapshot: DataChartSnapshot) => void;
}
