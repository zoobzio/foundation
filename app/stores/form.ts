import type { Config, State } from "#foundation/types/data/form";

import { useState } from "#imports";

export const accessForm = <T>(id: string, config: Config<T>): State<T> => {
  const initialized = useState<boolean>(`form-${id}-initialized`, () => false);

  const payload = useState<Partial<T>>(`form-${id}-payload`, () => ({
    ...config.defaults,
  }));

  const errors = useState<Record<string, string>>(
    `form-${id}-errors`,
    () => ({}),
  );

  const touched = useState<Set<string>>(`form-${id}-touched`, () => new Set());

  const submitting = useState<boolean>(`form-${id}-submitting`, () => false);

  const submitted = useState<boolean>(`form-${id}-submitted`, () => false);

  return {
    initialized,
    payload,
    errors,
    touched,
    submitting,
    submitted,
  };
};
