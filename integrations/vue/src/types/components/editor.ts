import type { Passthrough, PassthroughIter, PT } from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/editor";
import type { ButtonHTMLAttributes, HTMLAttributes, VNode } from "vue";

/**
 * One tool of the toolbar: a button over one command of the service. `key`
 * names the mark, node, or action (`bold`, `heading-2`, `bulletList`,
 * `undo`); `active` follows the selection.
 */
export type EditorTool = {
  key: string;
  label: string;
  active: boolean;
  disabled: boolean;
  run: () => void;
};

/**
 * The parts of the editor that accept passthrough. `toolbar` and `content`
 * are the two `div`s; `tool` is each toolbar button, built per tool.
 * `content` is the element the service mounts the editor into.
 */
export type EditorPassthrough = {
  toolbar: Passthrough<HTMLAttributes>;
  tool: PassthroughIter<EditorTool, ButtonHTMLAttributes>;
  content: Passthrough<HTMLAttributes>;
};

/**
 * Props of the editor: the headless service plus passthrough. The editor
 * owns no feature state. The service's state container must be reactive
 * for the toolbar to follow the selection.
 */
export type EditorProps<I, O> = {
  service: Service<I, O>;
  pt?: PT<EditorPassthrough>;
};

/**
 * Emits of the editor: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `EDITOR_EVENTS` names
 * the relayed subset and is checked against these keys.
 */
export type EditorEmits = {
  loaded: Events["loaded"];
  updated: Events["updated"];
  mounted: Events["mounted"];
  unmounted: Events["unmounted"];
};

/**
 * The editor view model, served to `defineExpose` and the slots.
 */
export type EditorContext<I, O> = {
  editor: Service<I, O>;
  tools: EditorTool[];
  el: HTMLDivElement | null;
  settings: EditorPassthrough;
  /** Turns the editor on over the static copy. A no-op once mounted. */
  activate: () => void;
};

/**
 * Slots of the editor. `toolbar` replaces the whole toolbar; `tool`
 * replaces one button, given the tool.
 */
export type EditorSlots<I, O> = {
  toolbar?: (props: EditorContext<I, O>) => VNode[];
  tool?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
  toolPrepend?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
  toolAppend?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
};

/**
 * An editor instance as data: props plus emit listeners.
 */
export type EditorDefinition<I, O> = Definition<EditorProps<I, O>, EditorEmits>;
