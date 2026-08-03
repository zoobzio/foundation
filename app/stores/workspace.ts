import type { Config, Layout, State } from "#foundation/types/system/workspace";
import type { Widgets } from "#foundation/types/widget";

import { useState } from "#imports";

export const accessWorkspace = <R extends Widgets>(
  id: string,
  config: Config<R>,
): State<R> => {
  const initialized = useState<boolean>(
    `workspace-${id}-initialized`,
    () => false,
  );
  const loading = useState<boolean>(`workspace-${id}-loading`, () => false);
  const layout = useState<Layout<R>>(
    `workspace-${id}-layout`,
    () => config.layout,
  );

  return { initialized, loading, layout };
};
