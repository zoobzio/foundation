import type { Item, State } from "../types/data/autocomplete";

import { useState } from "#imports";

export const accessAutocomplete = <M>(id: string): State<M> => {
  const input = useState<string>(`autocomplete-${id}-input`, () => "");

  const steps = useState<Item<M>[]>(`autocomplete-${id}-steps`, () => []);

  const focused = useState<boolean>(`autocomplete-${id}-focused`, () => false);

  const highlight = useState<number>(`autocomplete-${id}-highlight`, () => 0);

  return {
    input,
    steps,
    focused,
    highlight,
  };
};
