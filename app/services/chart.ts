import type { NuxtApp } from "#app";
import type {
  Actions,
  BucketSize,
  Config,
  DataChartVariant,
  Service,
  State,
} from "../types/data/chart";
import type { Logger } from "../types/log";

import { buildVariants, aggregateBreakdown } from "../utils/chart";
import { VARIANT_LABELS } from "../constants/chart";

export class ChartService<T> implements Service<T> {
  private readonly log: Logger;
  private readonly emit: NuxtApp["callHook"];

  readonly variants: DataChartVariant<T>[];
  private readonly variantMap: Map<string, DataChartVariant<T>>;
  private readonly firstVariant: DataChartVariant<T>;

  constructor(
    nuxt: NuxtApp,
    public readonly id: string,
    public readonly config: Config<T>,
    private readonly state: State<T>,
    private readonly actions: Actions<T>,
  ) {
    this.log = nuxt.$logger(this.id);
    this.emit = nuxt.callHook;

    this.variants = buildVariants(config);
    this.variantMap = new Map(this.variants.map((v) => [v.type, v]));

    const [first] = this.variants;
    if (!first) throw new Error(`chart ${id} declares no variants`);
    this.firstVariant = first;
  }

  get initialized(): boolean {
    return this.state.initialized.value;
  }

  get loading(): boolean {
    return this.state.loading.value;
  }

  get variantData() {
    return this.state.variantData.value;
  }

  get activeVariant(): string {
    return this.state.activeVariant.value;
  }

  get activeRenderer(): string {
    return this.state.activeRenderer.value;
  }

  get activeField(): keyof T | null {
    return this.state.activeField.value;
  }

  get activeGroupBy(): keyof T | null {
    return this.state.activeGroupBy.value;
  }

  get activeX(): keyof T | null {
    return this.state.activeX.value;
  }

  get activeY(): keyof T | null {
    return this.state.activeY.value;
  }

  get activeBucket(): BucketSize | null {
    return this.state.activeBucket.value;
  }

  get activeRange(): [Date, Date] | null {
    return this.state.activeRange.value;
  }

  get activeVariantConfig(): DataChartVariant<T> {
    return this.variantMap.get(this.activeVariant) ?? this.firstVariant;
  }

  get title(): string {
    return `${this.config.topic} ${
      VARIANT_LABELS[this.activeVariant] ?? this.activeVariant
    }`;
  }

  setVariant(type: string): void {
    const variant = this.variantMap.get(type);
    if (!variant) return;

    this.state.activeVariant.value = type;
    this.state.activeRenderer.value = variant.renderers[0]?.type ?? "";
    this.state.activeField.value = variant.fields[0] ?? null;
    this.state.activeGroupBy.value = variant.fields[1] ?? null;
    this.state.activeX.value = variant.fields[0] ?? null;
    this.state.activeY.value = variant.fields[1] ?? null;

    if (variant.type === "series") {
      this.state.activeBucket.value = variant.buckets[0] ?? null;
      this.state.activeRange.value = variant.defaultRange;
    } else if (variant.type === "distribution") {
      this.state.activeBucket.value = null;
      this.state.activeRange.value = variant.defaultRange;
    } else {
      this.state.activeBucket.value = null;
      this.state.activeRange.value = null;
    }

    this.log.debug("Chart variant changed", { id: this.id, variant: type });
    this.emit("chart:variant-changed", { id: this.id, variant: type });
    this.fetch();
  }

  setRenderer(type: string): void {
    if (!this.activeVariantConfig.renderers.some((r) => r.type === type)) return;
    this.state.activeRenderer.value = type;
    this.log.debug("Chart renderer changed", { id: this.id, renderer: type });
    this.emit("chart:renderer-changed", { id: this.id, renderer: type });
  }

  setField(field: string): void {
    const match = this.activeVariantConfig.fields.find(
      (f) => String(f) === field,
    );
    if (match === undefined) return;
    this.state.activeField.value = match;
    this.fetch();
  }

  setGroupBy(field: string): void {
    const match = this.activeVariantConfig.fields.find(
      (f) => String(f) === field,
    );
    if (match === undefined) return;
    this.state.activeGroupBy.value = match;
    this.fetch();
  }

  setX(field: string): void {
    const match = this.activeVariantConfig.fields.find(
      (f) => String(f) === field,
    );
    if (match === undefined) return;
    this.state.activeX.value = match;
    this.fetch();
  }

  setY(field: string): void {
    const match = this.activeVariantConfig.fields.find(
      (f) => String(f) === field,
    );
    if (match === undefined) return;
    this.state.activeY.value = match;
    this.fetch();
  }

  setBucket(bucket: string): void {
    const variant = this.activeVariantConfig;
    if (variant.type !== "series") return;
    const match = variant.buckets.find((b) => b === bucket);
    if (!match) return;
    this.state.activeBucket.value = match;
    this.fetch();
  }

  setRange(range: [Date, Date]): void {
    this.state.activeRange.value = range;
    this.fetch();
  }

  async init(): Promise<boolean> {
    if (this.state.initialized.value) return true;
    this.state.initialized.value = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading.value = true;
    try {
      const variant = this.activeVariantConfig;

      switch (variant.type) {
        case "breakdown": {
          const field = this.activeField;
          if (!this.actions.breakdown || field === null) break;
          const result = await this.actions.breakdown(
            { field, limit: variant.limit },
            this,
          );
          this.state.variantData.value = aggregateBreakdown(
            result,
            variant.limit,
          );
          break;
        }
        case "series": {
          const field = this.activeField;
          const bucket = this.activeBucket;
          const range = this.activeRange;
          if (
            !this.actions.series ||
            field === null ||
            bucket === null ||
            range === null
          )
            break;
          this.state.variantData.value = await this.actions.series(
            { field, bucket, range },
            this,
          );
          break;
        }
        case "distribution": {
          const x = this.activeX;
          const y = this.activeY;
          const range = this.activeRange;
          if (
            !this.actions.distribution ||
            x === null ||
            y === null ||
            range === null
          )
            break;
          this.state.variantData.value = await this.actions.distribution(
            { x, y, range },
            this,
          );
          break;
        }
        case "comparison": {
          const field = this.activeField;
          const groupBy = this.activeGroupBy;
          if (!this.actions.comparison || field === null || groupBy === null)
            break;
          this.state.variantData.value = await this.actions.comparison(
            { field, groupBy, limit: variant.limit },
            this,
          );
          break;
        }
      }
    } finally {
      this.state.loading.value = false;
      this.log.debug("Chart updated", {
        id: this.id,
        variant: this.activeVariant,
      });
      this.emit("chart:updated", {
        id: this.id,
        variant: this.activeVariant,
        data: this.variantData,
      });
    }
  }
}
