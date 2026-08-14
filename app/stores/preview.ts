import type { State } from "../types/data/preview";

import { useState } from "#imports";

export const accessPreview = <T>(id: string): State<T> => {
  const initialized = useState<boolean>(
    `preview-${id}-initialized`,
    () => false,
  );
  const loading = useState<boolean>(`preview-${id}-loading`, () => false);
  const data = useState<T | null>(`preview-${id}-data`, () => null);

  return { initialized, loading, data };
};
