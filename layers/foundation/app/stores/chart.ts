import type {
  BucketSize,
  Config,
  State,
  VariantData,
} from "../types/data/chart";

import { useState } from "#imports";
import { buildVariants, resolveChartDefaults } from "../utils/chart";

export const accessChart = <T>(id: string, config: Config<T>): State<T> => {
  const defaults = resolveChartDefaults(buildVariants(config));

  const initialized = useState<boolean>(`chart-${id}-initialized`, () => false);
  const loading = useState<boolean>(`chart-${id}-loading`, () => false);
  const variantData = useState<VariantData | null>(
    `chart-${id}-variantData`,
    () => null,
  );

  const activeVariant = useState<string>(
    `chart-${id}-activeVariant`,
    () => defaults.activeVariant,
  );
  const activeRenderer = useState<string>(
    `chart-${id}-activeRenderer`,
    () => defaults.activeRenderer,
  );
  const activeField = useState<keyof T | null>(
    `chart-${id}-activeField`,
    () => defaults.activeField,
  );
  const activeGroupBy = useState<keyof T | null>(
    `chart-${id}-activeGroupBy`,
    () => defaults.activeGroupBy,
  );
  const activeX = useState<keyof T | null>(
    `chart-${id}-activeX`,
    () => defaults.activeX,
  );
  const activeY = useState<keyof T | null>(
    `chart-${id}-activeY`,
    () => defaults.activeY,
  );
  const activeBucket = useState<BucketSize | null>(
    `chart-${id}-activeBucket`,
    () => defaults.activeBucket,
  );
  const activeRange = useState<[Date, Date] | null>(
    `chart-${id}-activeRange`,
    () => defaults.activeRange,
  );

  return {
    initialized,
    loading,
    variantData,
    activeVariant,
    activeRenderer,
    activeField,
    activeGroupBy,
    activeX,
    activeY,
    activeBucket,
    activeRange,
  };
};
