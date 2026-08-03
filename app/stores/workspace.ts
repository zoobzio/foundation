import type { Config, Layout, State } from "#foundation/types/system/workspace";

import { useState } from "#imports";

export const accessWorkspace = (id: string, config: Config): State => {
  const initialized = useState<boolean>(
    `workspace-${id}-initialized`,
    () => false,
  );
  const loading = useState<boolean>(`workspace-${id}-loading`, () => false);
  const layout = useState<Layout>(`workspace-${id}-layout`, () => config.layout);

  return { initialized, loading, layout };
};
