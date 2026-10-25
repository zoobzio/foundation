import type { State } from "@zoobzio/editor";

import { useState } from "#app";
import { createEditorState } from "@zoobzio/editor";

/**
 * The Nuxt backing for an editor's state container: one `useState` record
 * keyed `editor-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app, and it survives SSR hydration. The document is not in
 * the container: each service holds its own editor, and `load` must run
 * where the editor runs.
 */
export const accessEditor = (id: string): State =>
  useState<State>(`editor-${id}`, () => createEditorState()).value;
