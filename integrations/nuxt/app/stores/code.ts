import type { State } from "@zoobzio/code";

import { useState } from "#app";
import { createCodeState } from "@zoobzio/code";

/**
 * The Nuxt backing for a code editor's state container: one `useState`
 * record keyed `code-<id>`. Its value is a reactive proxy, so the
 * service's field writes are tracked; instances sharing an id share the
 * container across the app, and it survives SSR hydration. The document is
 * not in the container: each service holds its own editor, and `load` must
 * run where the editor runs.
 */
export const accessCode = (id: string): State =>
  useState<State>(`code-${id}`, () => createCodeState()).value;
