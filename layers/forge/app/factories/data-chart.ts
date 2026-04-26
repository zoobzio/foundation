import type {
  Chart,
  DataChartConfig,
  DataChartVariant,
  BucketSize,
  BreakdownVariant,
  BreakdownData,
  SeriesVariant,
  SeriesData,
  DistributionVariant,
  DistributionData,
  VariantData,
} from "../types/data-chart";
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
import { DataChartSnapshotSchema } from "../schemas/data-chart";
import type { DataChartSnapshot } from "../schemas/data-chart";

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
// Default palette
// ---------------------------------------------------------------------------

const PALETTE = [
  "hsl(210, 80%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(160, 60%, 45%)",
  "hsl(45, 90%, 50%)",
  "hsl(270, 60%, 55%)",
  "hsl(20, 85%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(300, 50%, 55%)",
];

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
} as const;

function mergeOptions(renderer: { options?: Record<string, unknown> }) {
  return { ...BASE_OPTIONS, ...renderer.options } as import("chart.js").ChartOptions;
}

// ---------------------------------------------------------------------------
// Variant label for title
// ---------------------------------------------------------------------------

const VARIANT_LABELS: Record<string, string> = {
  breakdown: "Breakdown",
  series: "Series",
  distribution: "Distribution",
};

// ---------------------------------------------------------------------------
// Narrowed renderers
// ---------------------------------------------------------------------------

function renderBreakdown<T>(
  el: HTMLCanvasElement,
  variant: BreakdownVariant<T>,
  data: BreakdownData,
  rendererType: string,
): ChartJS {
  const renderer = variant.renderers.find((r) => r.type === rendererType) ?? variant.renderers[0]!;
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: PALETTE.slice(0, data.values.length),
      }],
    },
    options: mergeOptions(renderer),
  });
}

function renderSeries<T>(
  el: HTMLCanvasElement,
  variant: SeriesVariant<T>,
  data: SeriesData,
  rendererType: string,
): ChartJS {
  const renderer = variant.renderers.find((r) => r.type === rendererType) ?? variant.renderers[0]!;
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      labels: data.labels,
      datasets: data.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: PALETTE[i % PALETTE.length],
        backgroundColor: PALETTE[i % PALETTE.length],
      })),
    },
    options: mergeOptions(renderer),
  });
}

function renderDistribution<T>(
  el: HTMLCanvasElement,
  variant: DistributionVariant<T>,
  data: DistributionData,
  rendererType: string,
): ChartJS {
  const renderer = variant.renderers.find((r) => r.type === rendererType) ?? variant.renderers[0]!;
  return new ChartJS(el, {
    type: renderer.type,
    data: {
      datasets: data.datasets.map((ds, i) => ({
        label: ds.label,
        data: ds.data,
        borderColor: PALETTE[i % PALETTE.length],
        backgroundColor: PALETTE[i % PALETTE.length],
      })),
    },
    options: mergeOptions(renderer),
  });
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export const createChart = <T>(id: string, config: DataChartConfig<T>) => {
  return (): Chart<T> => {
    const configs = inject(WIDGET_CONFIGS, {});
    const raw = configs[id];
    const defaults = DataChartSnapshotSchema.parse(raw ?? {});

    // Initialization
    const initialized = useState<boolean>(
      `chart-${id}-initialized`,
      () => false,
    );

    // Canvas binding
    const canvas = ref<HTMLCanvasElement | null>(null);

    // State
    const loading = useState<boolean>(`chart-${id}-loading`, () => false);
    const variantData = useState<VariantData | null>(
      `chart-${id}-variantData`,
      () => null,
    );

    // Build variants from config keys
    const variants: DataChartVariant<T>[] = [];
    if (config.breakdown) variants.push({ type: "breakdown", ...config.breakdown });
    if (config.series) variants.push({ type: "series", ...config.series });
    if (config.distribution) variants.push({ type: "distribution", ...config.distribution });
    const variantMap: Map<string, DataChartVariant<T>> = new Map(variants.map((v) => [v.type, v]));

    // Resolve first variant defaults
    const firstVariant = variants[0]!;
    const firstRenderer = firstVariant.renderers[0]?.type ?? "";

    const activeVariant = useState<string>(
      `chart-${id}-activeVariant`,
      () => defaults.activeVariant || firstVariant.type,
    );
    const activeRenderer = useState<string>(
      `chart-${id}-activeRenderer`,
      () => defaults.activeRenderer || firstRenderer,
    );
    const activeField = useState<keyof T | null>(
      `chart-${id}-activeField`,
      () => (defaults.activeField as keyof T | null) ?? firstVariant.fields[0] ?? null,
    );
    const activeX = useState<keyof T | null>(
      `chart-${id}-activeX`,
      () => (defaults.activeX as keyof T | null) ?? firstVariant.fields[0] ?? null,
    );
    const activeY = useState<keyof T | null>(
      `chart-${id}-activeY`,
      () => (defaults.activeY as keyof T | null) ?? firstVariant.fields[1] ?? null,
    );
    const activeBucket = useState<BucketSize | null>(
      `chart-${id}-activeBucket`,
      () => {
        if (defaults.activeBucket) return defaults.activeBucket;
        const s = variants.find((v) => v.type === "series") as SeriesVariant<T> | undefined;
        return s?.buckets[0] ?? null;
      },
    );
    const activeRange = useState<[Date, Date] | null>(
      `chart-${id}-activeRange`,
      () => {
        if (defaults.activeRange) return defaults.activeRange;
        const v = variantMap.get(activeVariant.value);
        if (v && "defaultRange" in v) return v.defaultRange;
        return null;
      },
    );

    // Getters
    const activeVariantConfig = computed<DataChartVariant<T>>(
      () => variantMap.get(activeVariant.value) ?? variants[0]!,
    );

    const title = computed(
      () => `${config.topic} ${VARIANT_LABELS[activeVariant.value] ?? activeVariant.value}`,
    );

    // Chart.js instance — managed internally via watchEffect
    let instance: ChartJS | null = null;

    watchEffect((onCleanup) => {
      const el = canvas.value;
      const data = variantData.value;
      const variant = activeVariantConfig.value;
      const rendererType = activeRenderer.value;

      instance?.destroy();
      instance = null;

      if (!el || !data) return;

      switch (variant.type) {
        case "breakdown":
          instance = renderBreakdown(el, variant, data as BreakdownData, rendererType);
          break;
        case "series":
          instance = renderSeries(el, variant, data as SeriesData, rendererType);
          break;
        case "distribution":
          instance = renderDistribution(el, variant, data as DistributionData, rendererType);
          break;
      }

      onCleanup(() => {
        instance?.destroy();
        instance = null;
      });
    });

    // Actions
    const setVariant = (type: string) => {
      if (!variantMap.has(type)) return;
      const variant = variantMap.get(type)!;
      activeVariant.value = type;
      activeRenderer.value = variant.renderers[0]?.type ?? "";
      activeField.value = variant.fields[0] ?? null;
      activeX.value = variant.fields[0] ?? null;
      activeY.value = variant.fields[1] ?? null;
      if (variant.type === "series") {
        activeBucket.value = variant.buckets[0] ?? null;
        activeRange.value = variant.defaultRange;
      } else if (variant.type === "distribution") {
        activeRange.value = variant.defaultRange;
      } else {
        activeBucket.value = null;
        activeRange.value = null;
      }
      fetchData();
    };

    const setRenderer = (type: string) => {
      const variant = activeVariantConfig.value;
      if (!variant.renderers.some((r) => r.type === type)) return;
      activeRenderer.value = type;
    };

    const setField = (field: keyof T) => {
      activeField.value = field;
      fetchData();
    };

    const setX = (field: keyof T) => {
      activeX.value = field;
      fetchData();
    };

    const setY = (field: keyof T) => {
      activeY.value = field;
      fetchData();
    };

    const setBucket = (bucket: BucketSize) => {
      activeBucket.value = bucket;
      fetchData();
    };

    const setRange = (range: [Date, Date]) => {
      activeRange.value = range;
      fetchData();
    };

    // Persistence
    const getSnapshot = (): DataChartSnapshot => ({
      activeVariant: activeVariant.value,
      activeRenderer: activeRenderer.value,
      activeField: activeField.value as string | null,
      activeX: activeX.value as string | null,
      activeY: activeY.value as string | null,
      activeBucket: activeBucket.value,
      activeRange: activeRange.value,
    });

    const restoreSnapshot = (snapshot: DataChartSnapshot) => {
      activeVariant.value = snapshot.activeVariant;
      activeRenderer.value = snapshot.activeRenderer;
      activeField.value = snapshot.activeField as keyof T | null;
      activeX.value = snapshot.activeX as keyof T | null;
      activeY.value = snapshot.activeY as keyof T | null;
      activeBucket.value = snapshot.activeBucket;
      activeRange.value = snapshot.activeRange;
      fetchData();
    };

    // Init — idempotent
    const init = async () => {
      if (initialized.value) return true;
      initialized.value = true;
      await fetchData();
      return true;
    };

    // Fetch — dispatches per variant type
    const fetchData = async () => {
      loading.value = true;
      try {
        const queryParams = config.params();
        const variant = activeVariantConfig.value;

        switch (variant.type) {
          case "breakdown": {
            if (!activeField.value) break;
            const result = await variant.fetch({
              field: activeField.value,
              query: queryParams,
            });
            variantData.value = result;
            break;
          }
          case "series": {
            if (!activeField.value || !activeBucket.value || !activeRange.value) break;
            const result = await variant.fetch({
              field: activeField.value,
              bucket: activeBucket.value,
              range: activeRange.value,
              query: queryParams,
            });
            variantData.value = result;
            break;
          }
          case "distribution": {
            if (!activeX.value || !activeY.value || !activeRange.value) break;
            const result = await variant.fetch({
              x: activeX.value,
              y: activeY.value,
              range: activeRange.value,
              query: queryParams,
            });
            variantData.value = result;
            break;
          }
        }
      } finally {
        loading.value = false;
        useNuxtApp().callHook("widget:chart:snapshot", {
          id,
          snapshot: getSnapshot(),
        });
      }
    };

    return {
      canvas,
      loading,
      initialized,
      activeVariant,
      activeRenderer,
      activeField,
      activeX,
      activeY,
      activeBucket,
      activeRange,
      variantData,
      topic: config.topic,
      variants,
      activeVariantConfig,
      title,
      setVariant,
      setRenderer,
      setField,
      setX,
      setY,
      setBucket,
      setRange,
      fetch: fetchData,
      init,
      getSnapshot,
      restoreSnapshot,
    };
  };
};
