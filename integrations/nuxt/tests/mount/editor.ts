import type { Actions, Config, Doc, State } from "@zoobzio/editor";

import { reactive } from "vue";
import { EditorService, createEditorState } from "@zoobzio/editor";
import { passthrough } from "#test/data/editor";

/**
 * A real editor service over a reactive container, in the editor's own
 * form. The shape every consumer builds.
 */
export const makeEditor = (
  config: Config = {},
  actions: Partial<Actions<Doc, Doc>> = {},
) => {
  const state: State = reactive(createEditorState());
  const service = new EditorService<Doc, Doc>("test-editor", config, state, {
    ...passthrough,
    ...actions,
  });
  return { service, state };
};
