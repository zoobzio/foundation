import type { Text } from "@zoobzio/kit";
import type { FabEmits, FabProps } from "./fab";
import type { MenuContext, MenuEmits, MenuItem, MenuProps } from "./menu";
import type {
  Passthrough,
  PassthroughIter,
  PT,
  Rendered,
  RenderedIter,
} from "../passthrough";
import type { Definition } from "../definition";
import type { Events, Service } from "@zoobzio/editor";
import type { ToolbarRootProps, ToolbarSeparatorProps } from "reka-ui";
import type { ButtonHTMLAttributes, HTMLAttributes, VNode } from "vue";

/**
 * What a tool does when pressed. A `toggle` turns a mark or node on and
 * off and reports `aria-pressed`; an `action` runs once (undo, redo, a
 * rule) and is never pressed.
 */
export type EditorToolKind = "toggle" | "action";

/**
 * The groups of the toolbar, in order: the headings, the marks, the
 * lists, the other blocks (quote, code block, rule), and history. A
 * separator stands between one group and the next. The headings render
 * as one dropdown, the block type, rather than as a button each.
 */
export type EditorToolGroup =
  | "headings"
  | "marks"
  | "lists"
  | "blocks"
  | "history";

/**
 * One tool of the toolbar: a button over one command of the service. `key`
 * names the mark, node, or action (`bold`, `heading-2`, `bulletList`,
 * `undo`); `active` follows the selection; `disabled` says the command
 * would not apply there (a mark inside a code block, undo with nothing
 * to undo).
 */
export interface EditorTool {
  key: string;
  label: Text;
  kind: EditorToolKind;
  group: EditorToolGroup;
  active: boolean;
  disabled: boolean;
  run: () => void;
}

/**
 * One group of the toolbar as rendered: its name and its tools, in order.
 * Only groups that hold a tool are rendered.
 */
export interface EditorGroup {
  name: EditorToolGroup;
  tools: EditorTool[];
}

/**
 * One block type the dropdown offers: the paragraph, or a heading by
 * level. `value` is the heading tool's key (`heading-2`), or `paragraph`;
 * `disabled` follows the tool's. A menu item, since the dropdown is the
 * package's Menu.
 */
export interface EditorBlock extends MenuItem {
  value: string;
}

/**
 * The parts of the editor that accept passthrough. `toolbar` is reka's
 * toolbar root, which gives the controls one tab stop and arrow-key
 * focus; `separator` is the divider between two groups; `block` is the
 * block type dropdown, a Menu rendered through `Primitive` over the
 * blocks, whose trigger the editor renders in the toolbar's focus order;
 * `tool` is each button, built per tool, a Fab rendered through
 * `Primitive` with the tool's label as its accessible name; `content` is
 * the element the service mounts the editor into.
 */
export type EditorPassthrough = {
  toolbar: Passthrough<ToolbarRootProps & HTMLAttributes>;
  separator: PassthroughIter<
    EditorGroup,
    ToolbarSeparatorProps & HTMLAttributes
  >;
  block: Rendered<MenuProps<EditorBlock>, MenuEmits<EditorBlock>>;
  tool: RenderedIter<EditorTool, FabProps & ButtonHTMLAttributes, FabEmits>;
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
  groups: EditorGroup[];
  /** The block types the dropdown offers, the paragraph first. */
  blocks: EditorBlock[];
  /** The block type at the selection. */
  block: EditorBlock;
  el: HTMLDivElement | null;
  settings: EditorPassthrough;
  /** Turns the editor on over the static copy. A no-op once mounted. */
  activate: () => void;
};

/**
 * Slots of the editor. `toolbar` replaces the whole toolbar; `separator`
 * replaces the divider before a group, given the group; `block` replaces
 * the block type dropdown, roving focus included, and `blockLabel`,
 * `blockAppend`, and `blockItemLabel` fill its trigger and its items,
 * each given the Menu's context; `tool` replaces one button, given the
 * tool, roving focus included; `toolPrepend`, `toolLabel`, and
 * `toolAppend` fill the button, so a label slot that draws an icon makes
 * the button icon-only while the tool's label stays its accessible name.
 */
export type EditorSlots<I, O> = {
  toolbar?: (props: EditorContext<I, O>) => VNode[];
  separator?: (props: EditorContext<I, O> & { group: EditorGroup }) => VNode[];
  block?: (props: EditorContext<I, O> & { group: EditorGroup }) => VNode[];
  blockLabel?: (
    props: EditorContext<I, O> & { menu: MenuContext<EditorBlock> },
  ) => VNode[];
  blockAppend?: (
    props: EditorContext<I, O> & { menu: MenuContext<EditorBlock> },
  ) => VNode[];
  blockItemLabel?: (
    props: EditorContext<I, O> & {
      menu: MenuContext<EditorBlock>;
      item: EditorBlock;
    },
  ) => VNode[];
  tool?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
  toolPrepend?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
  toolLabel?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
  toolAppend?: (props: EditorContext<I, O> & { tool: EditorTool }) => VNode[];
};

/**
 * An editor instance as data: props plus emit listeners.
 */
export type EditorDefinition<I, O> = Definition<EditorProps<I, O>, EditorEmits>;
