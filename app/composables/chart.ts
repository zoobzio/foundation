import type { Service, RendererConfig } from "../types/data/chart";
import type {
  ChartControlAnchor,
  ChartControlOption,
  ChartControlPassthrough,
} from "../types/data/chart/control";
import type { MenuGroup, MenuItem } from "../types/core/menu";
import type { MaybeRefOrGetter, ShallowRef } from "vue";

import { computed, toValue, watchEffect } from "#imports";
import { useServiceRefs } from "./refs";
import {
  CHART_BUCKET_LABEL,
  CHART_FIELD_LABEL,
  CHART_GROUP_BY_LABEL,
  CHART_RENDERER_LABEL,
  CHART_X_LABEL,
  CHART_Y_LABEL,
  VARIANT_LABELS,
} from "../constants/chart";
import {
  renderBreakdown,
  renderComparison,
  renderDistribution,
  renderSeries,
} from "../utils/chart";

/**
 * The view surface of the chart feature, shared by every chart component:
 * the service's state as refs, the toolbar selector descriptors (variant in
 * the title region, dimension/renderer selectors in the actions region), the
 * per-control scope, and the canvas scope. DOM — canvas, chart.js,
 * `getComputedStyle` — stops in the canvas scope, never the service.
 */
export const useChartView = <T>(chart: Service<T>) => {
  const serviceRefs = useServiceRefs(chart);

  const controls = computed<ChartControlAnchor[]>(() => {
    const variant = chart.activeVariantConfig;
    const list: ChartControlAnchor[] = [];

    const fieldOptions = (active: keyof T | null): ChartControlOption[] =>
      variant.fields.map((f) => ({
        value: String(f),
        label: String(f),
        disabled: active !== null && String(f) === String(active),
      }));

    // Variant selector — title region
    list.push({
      kind: "variant",
      align: "start",
      trigger: { type: "title", label: chart.title },
      options: chart.variants.map((v) => ({
        value: v.type,
        label: VARIANT_LABELS[v.type] ?? v.type,
        disabled: v.type === chart.activeVariant,
      })),
    });

    // Dimension selectors — actions region, per variant type
    switch (variant.type) {
      case "breakdown":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", label: CHART_FIELD_LABEL },
          options: fieldOptions(chart.activeField),
        });
        break;
      case "series":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", label: CHART_FIELD_LABEL },
          options: fieldOptions(chart.activeField),
        });
        list.push({
          kind: "bucket",
          align: "end",
          trigger: { type: "fab", label: CHART_BUCKET_LABEL },
          options: variant.buckets.map((b) => ({
            value: b,
            label: b,
            disabled: b === chart.activeBucket,
          })),
        });
        break;
      case "distribution":
        list.push({
          kind: "x",
          align: "end",
          trigger: { type: "fab", label: CHART_X_LABEL },
          options: fieldOptions(chart.activeX),
        });
        list.push({
          kind: "y",
          align: "end",
          trigger: { type: "fab", label: CHART_Y_LABEL },
          options: fieldOptions(chart.activeY),
        });
        break;
      case "comparison":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", label: CHART_FIELD_LABEL },
          options: fieldOptions(chart.activeField),
        });
        list.push({
          kind: "groupBy",
          align: "end",
          trigger: { type: "fab", label: CHART_GROUP_BY_LABEL },
          options: fieldOptions(chart.activeGroupBy),
        });
        break;
    }

    // Renderer selector — actions region, every variant
    list.push({
      kind: "renderer",
      align: "end",
      trigger: { type: "fab", label: CHART_RENDERER_LABEL },
      options: variant.renderers.map((r: RendererConfig) => ({
        value: r.type,
        label: r.label ?? r.type,
        disabled: r.type === chart.activeRenderer,
      })),
    });

    return list;
  });

  const titleControls = computed(() =>
    controls.value.filter((c) => c.align === "start"),
  );

  const actionControls = computed(() =>
    controls.value.filter((c) => c.align === "end"),
  );

  /**
   * The canvas scope: owns the chart.js instance and repaints it whenever
   * the machine's variant data, active variant, or renderer changes. The
   * instance is created only once a canvas element and data both exist, and
   * torn down on every re-render and on unmount.
   */
  const useCanvas = (
    canvasEl: Readonly<ShallowRef<HTMLCanvasElement | null>>,
  ) => {
    let instance: ReturnType<typeof renderBreakdown> = null;

    watchEffect((onCleanup) => {
      const el = canvasEl.value;
      const data = chart.variantData;
      const variant = chart.activeVariantConfig;
      const rendererType = chart.activeRenderer;
      const cm = chart.config.colorMap;

      instance?.destroy();
      instance = null;

      if (!el || !data) return;

      switch (variant.type) {
        case "breakdown":
          if ("values" in data) {
            instance = renderBreakdown(el, variant, data, rendererType, cm);
          }
          break;
        case "series":
          if ("datasets" in data && "labels" in data) {
            instance = renderSeries(el, variant, data, rendererType, cm);
          }
          break;
        case "distribution":
          if ("datasets" in data && !("labels" in data)) {
            instance = renderDistribution(el, variant, data, rendererType, cm);
          }
          break;
        case "comparison":
          if ("datasets" in data && "labels" in data) {
            instance = renderComparison(el, variant, data, rendererType, cm);
          }
          break;
      }

      onCleanup(() => {
        instance?.destroy();
        instance = null;
      });
    });
  };

  /**
   * The per-control scope: builds the control's menu groups from the
   * anchor's options and dispatches the picked value to the matching `set*`
   * method by the anchor's kind. Menu items carry no value, so selection is
   * mapped back through the option list by label (unique within a selector).
   */
  const useControl = (source: MaybeRefOrGetter<ChartControlAnchor>) => {
    const groups = computed<MenuGroup[]>(() => {
      const { kind, options } = toValue(source);
      return [
        {
          key: kind,
          items: options.map((o) => ({
            label: o.label,
            disabled: o.disabled,
          })),
        },
      ];
    });

    const onSelect = (item: MenuItem) => {
      const { kind, options } = toValue(source);
      const picked = options.find((o) => o.label === item.label);
      if (!picked) return;
      switch (kind) {
        case "variant":
          chart.setVariant(picked.value);
          break;
        case "field":
          chart.setField(picked.value);
          break;
        case "groupBy":
          chart.setGroupBy(picked.value);
          break;
        case "x":
          chart.setX(picked.value);
          break;
        case "y":
          chart.setY(picked.value);
          break;
        case "bucket":
          chart.setBucket(picked.value);
          break;
        case "renderer":
          chart.setRenderer(picked.value);
          break;
      }
    };

    const recipes = computed<Pick<ChartControlPassthrough, "menu">>(() => ({
      menu: {
        groups: groups.value,
        align: toValue(source).align,
        onSelect,
      },
    }));

    return { recipes };
  };

  return {
    ...serviceRefs,
    controls,
    titleControls,
    actionControls,
    useCanvas,
    useControl,
  };
};
