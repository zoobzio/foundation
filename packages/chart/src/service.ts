import type {
  Actions,
  BucketSize,
  Config,
  DataChartVariant,
  Emitter,
  Event,
  Events,
  Listener,
  Options,
  Service,
  State,
  VariantData,
} from "./types";

import { CHART_VARIANT_LABELS } from "./constants";
import { makeEmitter } from "./emitter";
import { makeProxy } from "./proxy";
import { aggregateBreakdown, buildVariants } from "./util";

/**
 * The headless chart machine. Owns the active selection (variant, renderer,
 * field, group, axes, bucket, range) and the fetched variant data; delegates
 * data loading to the per-variant `actions`. Rendering stays outside: the
 * service never touches a canvas.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy; the
 * service replaces each member as a whole. Each write emits `change`, and
 * the domain methods emit `updated`, `variantChanged`, and
 * `rendererChanged`. `on` subscribes.
 */
export class ChartService<T> implements Service<T> {
  readonly variants: DataChartVariant<T>[];

  private readonly state: State<T>;
  private readonly emitter: Emitter<Events<T>> = makeEmitter();
  private readonly variantMap: Map<string, DataChartVariant<T>>;
  private readonly firstVariant: DataChartVariant<T>;

  constructor(
    public readonly id: string,
    public readonly config: Config<T>,
    state: State<T>,
    private readonly actions: Actions<T>,
    options: Options<T> = {},
  ) {
    this.state = makeProxy(state, options, this.emitter);

    this.variants = buildVariants(config);
    this.variantMap = new Map(this.variants.map((v) => [v.type, v]));

    const [first] = this.variants;
    if (!first) throw new Error(`chart ${id} declares no variants`);
    this.firstVariant = first;
  }

  on<E extends Event<T>>(event: E, listener: Listener<T, E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get initialized(): boolean {
    return this.state.initialized;
  }
  get loading(): boolean {
    return this.state.loading;
  }
  get variantData(): VariantData | null {
    return this.state.variantData;
  }
  get activeVariant(): string {
    return this.state.activeVariant;
  }
  get activeRenderer(): string {
    return this.state.activeRenderer;
  }
  get activeField(): keyof T | null {
    return this.state.activeField;
  }
  get activeGroupBy(): keyof T | null {
    return this.state.activeGroupBy;
  }
  get activeX(): keyof T | null {
    return this.state.activeX;
  }
  get activeY(): keyof T | null {
    return this.state.activeY;
  }
  get activeBucket(): BucketSize | null {
    return this.state.activeBucket;
  }
  get activeRange(): [Date, Date] | null {
    return this.state.activeRange;
  }

  // --- derived ---------------------------------------------------------

  get activeVariantConfig(): DataChartVariant<T> {
    return this.variantMap.get(this.activeVariant) ?? this.firstVariant;
  }

  get title(): string {
    return `${this.config.topic} ${
      CHART_VARIANT_LABELS[this.activeVariant] ?? this.activeVariant
    }`;
  }

  // A field name resolved to a real key of the active variant, so the
  // container holds `keyof T`, never a loose string.
  private fieldOf(field: string): keyof T | undefined {
    return this.activeVariantConfig.fields.find((f) => String(f) === field);
  }

  // --- selection -------------------------------------------------------

  setVariant(type: string): void {
    const variant = this.variantMap.get(type);
    if (!variant) return;

    this.state.activeVariant = type;
    this.state.activeRenderer = variant.renderers[0]?.type ?? "";
    this.state.activeField = variant.fields[0] ?? null;
    this.state.activeGroupBy = variant.fields[1] ?? null;
    this.state.activeX = variant.fields[0] ?? null;
    this.state.activeY = variant.fields[1] ?? null;

    if (variant.type === "series") {
      this.state.activeBucket = variant.buckets[0] ?? null;
      this.state.activeRange = variant.defaultRange;
    } else if (variant.type === "distribution") {
      this.state.activeBucket = null;
      this.state.activeRange = variant.defaultRange;
    } else {
      this.state.activeBucket = null;
      this.state.activeRange = null;
    }

    this.emitter.emit("variantChanged", { id: this.id, variant: type });
    this.fetch();
  }

  setRenderer(type: string): void {
    if (!this.activeVariantConfig.renderers.some((r) => r.type === type))
      return;
    this.state.activeRenderer = type;
    this.emitter.emit("rendererChanged", { id: this.id, renderer: type });
  }

  setField(field: string): void {
    const match = this.fieldOf(field);
    if (match === undefined) return;
    this.state.activeField = match;
    this.fetch();
  }

  setGroupBy(field: string): void {
    const match = this.fieldOf(field);
    if (match === undefined) return;
    this.state.activeGroupBy = match;
    this.fetch();
  }

  setX(field: string): void {
    const match = this.fieldOf(field);
    if (match === undefined) return;
    this.state.activeX = match;
    this.fetch();
  }

  setY(field: string): void {
    const match = this.fieldOf(field);
    if (match === undefined) return;
    this.state.activeY = match;
    this.fetch();
  }

  setBucket(bucket: string): void {
    const variant = this.activeVariantConfig;
    if (variant.type !== "series") return;
    const match = variant.buckets.find((b) => b === bucket);
    if (!match) return;
    this.state.activeBucket = match;
    this.fetch();
  }

  setRange(range: [Date, Date]): void {
    this.state.activeRange = range;
    this.fetch();
  }

  // --- loading ---------------------------------------------------------

  async init(): Promise<boolean> {
    if (this.initialized) return true;
    this.state.initialized = true;
    await this.fetch();
    return true;
  }

  async fetch(): Promise<void> {
    this.state.loading = true;
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
          this.state.variantData = aggregateBreakdown(result, variant.limit);
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
          this.state.variantData = await this.actions.series(
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
          this.state.variantData = await this.actions.distribution(
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
          this.state.variantData = await this.actions.comparison(
            { field, groupBy, limit: variant.limit },
            this,
          );
          break;
        }
      }
    } finally {
      this.state.loading = false;
      this.emitter.emit("updated", {
        id: this.id,
        variant: this.activeVariant,
        data: this.variantData,
      });
    }
  }
}
