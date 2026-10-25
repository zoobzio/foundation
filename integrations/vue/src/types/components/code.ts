import type { Passthrough, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/code";
import type { HTMLAttributes, VNode } from "vue";

/**
 * The parts of the code editor that accept passthrough. `content` is the
 * host the service mounts the view into; `status` is the status line that
 * reports the cursor.
 */
export type CodePassthrough = {
  content: Passthrough<HTMLAttributes>;
  status: Passthrough<HTMLAttributes>;
};

/**
 * Props of the code editor: the headless service plus passthrough. The
 * component owns no feature state. The service's state container must be
 * reactive for the status line to follow the cursor.
 */
export type CodeProps<I, O> = {
  service: Service<I, O>;
  pt?: PT<CodePassthrough>;
};

/**
 * Emits of the code editor: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `CODE_EVENTS` names the
 * relayed subset and is checked against these keys.
 */
export type CodeEmits = {
  loaded: Events["loaded"];
  updated: Events["updated"];
  mounted: Events["mounted"];
  unmounted: Events["unmounted"];
};

/**
 * The code editor view model, served to `defineExpose` and the slots.
 */
export type CodeContext<I, O> = {
  code: Service<I, O>;
  el: HTMLDivElement | null;
  settings: CodePassthrough;
  /** Turns the editor on over the static copy. A no-op once mounted. */
  activate: () => void;
};

/**
 * Slots of the code editor. `status` replaces the status line.
 */
export type CodeSlots<I, O> = {
  status?: (props: CodeContext<I, O>) => VNode[];
};

/**
 * A code editor instance as data: props plus emit listeners.
 */
export type CodeDefinition<I, O> = Definition<CodeProps<I, O>, CodeEmits>;
