import type { Chart, RendererConfig } from "#foundation/types/data/chart";
import type {
  ChartControlAnchor,
  ChartControlOption,
  ChartControlPassthrough,
} from "#foundation/types/data/chart/control";
import type { MenuGroup, MenuItem } from "#foundation/types/core/menu";
import type { MaybeRefOrGetter, ShallowRef } from "vue";

import { computed, toValue, watchEffect } from "#imports";
import {
  CHART_BUCKET_ICON,
  CHART_FIELD_ICON,
  CHART_GROUP_BY_ICON,
  CHART_X_ICON,
  CHART_Y_ICON,
  RENDERER_FALLBACK_ICON,
  RENDERER_ICONS,
  VARIANT_LABELS,
} from "#foundation/constants/chart";
import {
  renderBreakdown,
  renderComparison,
  renderDistribution,
  renderSeries,
} from "#foundation/utils/chart";

/**
 * The feature half of the chart canvas: owns the chart.js instance and repaints
 * it whenever the machine's variant data, active variant, or renderer changes.
 * The instance is created only once a canvas element and data both exist, and
 * torn down on every re-render and on unmount. DOM stops here — the service
 * never sees canvas, chart.js, or `getComputedStyle`.
 */
export const useChartCanvas = <T>(
  chart: Chart<T>,
  canvasEl: Readonly<ShallowRef<HTMLCanvasElement | null>>,
) => {
  const { variantData, activeVariantConfig, activeRenderer } = chart;
  let instance: ReturnType<typeof renderBreakdown> = null;

  watchEffect((onCleanup) => {
    const el = canvasEl.value;
    const data = variantData.value;
    const variant = activeVariantConfig.value;
    const rendererType = activeRenderer.value;
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
 * The feature half of the chart widget: derives the toolbar selector
 * descriptors from the active variant. The variant selector sits in the title
 * region (`align: "start"`); field/group/axis/bucket/renderer selectors sit in
 * the actions region (`align: "end"`), gated by variant type.
 */
export const useChart = <T>(chart: Chart<T>) => {
  const controls = computed<ChartControlAnchor[]>(() => {
    const variant = chart.activeVariantConfig.value;
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
      trigger: { type: "title", label: chart.title.value },
      options: chart.variants.map((v) => ({
        value: v.type,
        label: VARIANT_LABELS[v.type] ?? v.type,
        disabled: v.type === chart.activeVariant.value,
      })),
    });

    // Dimension selectors — actions region, per variant type
    switch (variant.type) {
      case "breakdown":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", icon: CHART_FIELD_ICON },
          options: fieldOptions(chart.activeField.value),
        });
        break;
      case "series":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", icon: CHART_FIELD_ICON },
          options: fieldOptions(chart.activeField.value),
        });
        list.push({
          kind: "bucket",
          align: "end",
          trigger: { type: "fab", icon: CHART_BUCKET_ICON },
          options: variant.buckets.map((b) => ({
            value: b,
            label: b,
            disabled: b === chart.activeBucket.value,
          })),
        });
        break;
      case "distribution":
        list.push({
          kind: "x",
          align: "end",
          trigger: { type: "fab", icon: CHART_X_ICON, label: "X" },
          options: fieldOptions(chart.activeX.value),
        });
        list.push({
          kind: "y",
          align: "end",
          trigger: { type: "fab", icon: CHART_Y_ICON, label: "Y" },
          options: fieldOptions(chart.activeY.value),
        });
        break;
      case "comparison":
        list.push({
          kind: "field",
          align: "end",
          trigger: { type: "fab", icon: CHART_FIELD_ICON },
          options: fieldOptions(chart.activeField.value),
        });
        list.push({
          kind: "groupBy",
          align: "end",
          trigger: { type: "fab", icon: CHART_GROUP_BY_ICON },
          options: fieldOptions(chart.activeGroupBy.value),
        });
        break;
    }

    // Renderer selector — actions region, every variant
    list.push({
      kind: "renderer",
      align: "end",
      trigger: {
        type: "fab",
        icon: RENDERER_ICONS[chart.activeRenderer.value] ?? RENDERER_FALLBACK_ICON,
      },
      options: variant.renderers.map((r: RendererConfig) => ({
        value: r.type,
        label: r.label ?? r.type,
        icon: RENDERER_ICONS[r.type],
        disabled: r.type === chart.activeRenderer.value,
      })),
    });

    return list;
  });

  return { controls };
};

/**
 * The feature half of a toolbar control: builds its menu groups from the
 * anchor's options and dispatches the picked value to the matching `set*`
 * method by the anchor's kind. Menu items carry no value, so selection is
 * mapped back through the option list by label (unique within a selector).
 */
export const useChartControl = <T>(
  chart: Chart<T>,
  source: MaybeRefOrGetter<ChartControlAnchor>,
) => {
  const groups = computed<MenuGroup[]>(() => {
    const { kind, options } = toValue(source);
    return [
      {
        key: kind,
        items: options.map((o) => ({
          label: o.label,
          icon: o.icon,
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
