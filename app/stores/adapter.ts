import type { State } from "#foundation/types/data/adapter";

import { useState } from "#imports";

export const accessAdapter = <P>(id: string): State<P> => {
  const props = useState<Partial<P>>(`adapter-${id}-props`, () => ({}));
  return { props };
};
