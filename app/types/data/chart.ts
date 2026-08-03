import type { Ref } from "#imports";
import type { IconAlias } from "#foundation/types/common/iconic";
import type {
  ChartType as CJSChartType,
  ChartOptions as CJSChartOptions,
} from "chart.js";

// ---------------------------------------------------------------------------
// Variant data shapes — what each fetch action returns
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

export type ComparisonData = SeriesData;

export type VariantData =
  | BreakdownData
  | SeriesData
  | DistributionData
  | ComparisonData;

// ---------------------------------------------------------------------------
// Variant → renderer mapping
// ---------------------------------------------------------------------------

export type BreakdownRenderer = "pie" | "doughnut" | "polarArea" | "bar";
export type SeriesRenderer = "line" | "bar" | "radar";
export type DistributionRenderer = "scatter" | "bubble";
export type ComparisonRenderer = "bar" | "line" | "radar";

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
// Fetch params — per variant type, generic over T. The consumer's fetch
// action closes over its own query/filter context, so the machine passes
// only the chart-driven inputs.
// ---------------------------------------------------------------------------

export interface BreakdownFetchParams<T> {
  field: keyof T;
  limit?: number;
}

export interface SeriesFetchParams<T> {
  field: keyof T;
  bucket: BucketSize;
  range: [Date, Date];
}

export interface DistributionFetchParams<T> {
  x: keyof T;
  y: keyof T;
  range: [Date, Date];
}

export interface ComparisonFetchParams<T> {
  field: keyof T;
  groupBy: keyof T;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Per-variant static config — pure data the consumer declares. No methods:
// the async fetch mechanism lives in `Actions`, keyed by the same variant.
// ---------------------------------------------------------------------------

export interface BreakdownConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<BreakdownRenderer>[];
  limit?: number;
}

export interface SeriesConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<SeriesRenderer>[];
  buckets: BucketSize[];
  defaultRange: [Date, Date];
}

export interface DistributionConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<DistributionRenderer>[];
  defaultRange: [Date, Date];
}

export interface ComparisonConfig<T> {
  fields: (keyof T)[];
  renderers: RendererConfig<ComparisonRenderer>[];
  limit?: number;
}

// ---------------------------------------------------------------------------
// Variant descriptors — the config sub-shape plus its discriminant. Built by
// the factory from whichever variant keys the config declares.
// ---------------------------------------------------------------------------

export type BreakdownVariant<T> = { type: "breakdown" } & BreakdownConfig<T>;
export type SeriesVariant<T> = { type: "series" } & SeriesConfig<T>;
export type DistributionVariant<T> = {
  type: "distribution";
} & DistributionConfig<T>;
export type ComparisonVariant<T> = { type: "comparison" } & ComparisonConfig<T>;

export type DataChartVariant<T> =
  | BreakdownVariant<T>
  | SeriesVariant<T>
  | DistributionVariant<T>
  | ComparisonVariant<T>;

// ---------------------------------------------------------------------------
// Config the consumer provides to the factory — pure data, zero methods.
// ---------------------------------------------------------------------------

export type Config<T> = {
  topic: string;
  colorMap?: Record<string, string>;
  breakdown?: BreakdownConfig<T>;
  series?: SeriesConfig<T>;
  distribution?: DistributionConfig<T>;
  comparison?: ComparisonConfig<T>;
};

// ---------------------------------------------------------------------------
// Raw reactive state — one Ref per key the store owns.
// ---------------------------------------------------------------------------

export type State<T> = {
  initialized: Ref<boolean>;
  loading: Ref<boolean>;
  variantData: Ref<VariantData | null>;
  activeVariant: Ref<string>;
  activeRenderer: Ref<string>;
  activeField: Ref<keyof T | null>;
  activeGroupBy: Ref<keyof T | null>;
  activeX: Ref<keyof T | null>;
  activeY: Ref<keyof T | null>;
  activeBucket: Ref<BucketSize | null>;
  activeRange: Ref<[Date, Date] | null>;
};

// ---------------------------------------------------------------------------
// Consumer-supplied fetch mechanism, one per declared variant. Each receives
// the chart-driven inputs and the live service; a variant exists iff config
// declares it, and the service guards the matching action's absence.
// ---------------------------------------------------------------------------

export type Actions<T> = {
  breakdown?: (
    params: BreakdownFetchParams<T>,
    service: Service<T>,
  ) => Promise<BreakdownData>;
  series?: (
    params: SeriesFetchParams<T>,
    service: Service<T>,
  ) => Promise<SeriesData>;
  distribution?: (
    params: DistributionFetchParams<T>,
    service: Service<T>,
  ) => Promise<DistributionData>;
  comparison?: (
    params: ComparisonFetchParams<T>,
    service: Service<T>,
  ) => Promise<ComparisonData>;
};

// ---------------------------------------------------------------------------
// The imperative contract for a data chart service: unwrapped state plus the
// full method surface. `ChartService<T>` declares `implements` against this,
// and fetch actions receive it.
// ---------------------------------------------------------------------------

export type Service<T> = {
  readonly id: string;
  readonly config: Config<T>;
  readonly variants: DataChartVariant<T>[];

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly variantData: VariantData | null;
  readonly activeVariant: string;
  readonly activeRenderer: string;
  readonly activeField: keyof T | null;
  readonly activeGroupBy: keyof T | null;
  readonly activeX: keyof T | null;
  readonly activeY: keyof T | null;
  readonly activeBucket: BucketSize | null;
  readonly activeRange: [Date, Date] | null;

  readonly activeVariantConfig: DataChartVariant<T>;
  readonly title: string;

  setVariant(type: string): void;
  setRenderer(type: string): void;
  setField(field: string): void;
  setGroupBy(field: string): void;
  setX(field: string): void;
  setY(field: string): void;
  setBucket(bucket: string): void;
  setRange(range: [Date, Date]): void;
  fetch(): Promise<void>;
  init(): Promise<boolean>;
};

// ---------------------------------------------------------------------------
// Events — one per discrete user-driven transition, each carrying `id`.
// Field/group/axis/bucket/range changes all refetch, so they surface through
// `chart:updated`; variant and renderer are the distinct discrete choices.
// ---------------------------------------------------------------------------

export type Events = {
  "chart:updated": (event: {
    id: string;
    variant: string;
    data: VariantData | null;
  }) => void;
  "chart:variant-changed": (event: { id: string; variant: string }) => void;
  "chart:renderer-changed": (event: { id: string; renderer: string }) => void;
};
