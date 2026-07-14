import { ref, computed } from "vue";
import { vi } from "vitest";
import type { Chart, DataChartVariant } from "#foundation/types/data/chart";

export interface MockChartOptions<T> {
  topic?: string;
  variants: DataChartVariant<T>[];
}

/**
 * Creates a mock Chart<T> with reactive refs and vi.fn() stubs for all methods.
 */
export const createMockChart = <T>(options: MockChartOptions<T>): Chart<T> => {
  const { topic = "Test", variants } = options;

  const activeVariant = ref(variants[0]?.type ?? "");
  const activeRenderer = ref(variants[0]?.renderers[0]?.type ?? "");
  const variantMap = new Map(variants.map((v) => [v.type, v]));

  return {
    canvas: ref(null),
    loading: ref(false),
    initialized: ref(true),
    activeVariant,
    activeRenderer,
    activeField: ref<keyof T | null>(variants[0]?.fields[0] ?? null),
    activeGroupBy: ref<keyof T | null>(variants[0]?.fields[1] ?? null),
    activeX: ref<keyof T | null>(variants[0]?.fields[0] ?? null),
    activeY: ref<keyof T | null>(variants[0]?.fields[1] ?? null),
    activeBucket: ref(null),
    activeRange: ref(null),
    variantData: ref(null),
    topic,
    variants,
    activeVariantConfig: computed(
      () => variantMap.get(activeVariant.value) ?? variants[0]!,
    ),
    title: computed(
      () => `${topic} ${activeVariant.value.charAt(0).toUpperCase() + activeVariant.value.slice(1)}`,
    ),
    setVariant: vi.fn((type: string) => {
      activeVariant.value = type;
      const v = variantMap.get(type);
      if (v) activeRenderer.value = v.renderers[0]?.type ?? "";
    }),
    setRenderer: vi.fn((type: string) => {
      activeRenderer.value = type;
    }),
    setField: vi.fn(),
    setGroupBy: vi.fn(),
    setX: vi.fn(),
    setY: vi.fn(),
    setBucket: vi.fn(),
    setRange: vi.fn(),
    fetch: vi.fn(async () => {}),
    init: vi.fn(async () => true),
    getSnapshot: vi.fn(() => ({
      activeVariant: activeVariant.value,
      activeRenderer: activeRenderer.value,
      activeField: null,
      activeGroupBy: null,
      activeX: null,
      activeY: null,
      activeBucket: null,
      activeRange: null,
    })),
    restoreSnapshot: vi.fn(),
  };
};
