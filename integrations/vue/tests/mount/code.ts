import type { Actions, Config, Doc, State } from "@zoobzio/code";

import { reactive } from "vue";
import { CodeService, createCodeState } from "@zoobzio/code";
import { passthrough } from "#test/data/code";

// happy-dom fires `selectionchange` in the same tick as the selection
// write, where a browser queues it; CodeMirror then re-enters its own
// update. The listener is deferred here once per environment, as a browser
// would, so the view behaves as it does in one.
const wrapped = new WeakMap<EventListener, EventListener>();
const add = document.addEventListener.bind(document);
const remove = document.removeEventListener.bind(document);
document.addEventListener = ((
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) => {
  if (type === "selectionchange" && typeof listener === "function") {
    const deferred: EventListener = (event) => {
      queueMicrotask(() => listener(event));
    };
    wrapped.set(listener, deferred);
    return add(type, deferred, options);
  }
  return add(type, listener, options);
}) as typeof document.addEventListener;
document.removeEventListener = ((
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
) =>
  remove(
    type,
    typeof listener === "function"
      ? (wrapped.get(listener) ?? listener)
      : listener,
    options,
  )) as typeof document.removeEventListener;

/**
 * A real code service over a reactive container, in the editor's own
 * form. The shape every consumer builds.
 */
export const makeCode = (
  config: Config = {},
  actions: Partial<Actions<Doc, Doc>> = {},
) => {
  const state: State = reactive(createCodeState());
  const service = new CodeService<Doc, Doc>("test-code", config, state, {
    ...passthrough,
    ...actions,
  });
  return { service, state };
};
