import type { FooterProps } from "../common/footer";
import type { GroupProps } from "../common/group";
import type { HeaderProps } from "../common/header";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "../passthrough";
import type { ServicesOf } from "../definition";
import type { Widgets } from "../widget";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * A grid cell: placement plus, in definitions, the widget configuration
 * that fills it. The slot's record key is its id — the registry key its
 * widget is instanced under, and the address `slot:`/`widget:` overrides
 * use.
 */
export type Slot = {
  position: [column: number, row: number];
  span: [columns: number, rows: number];
  widget?: unknown;
};

/**
 * The workspace's static configuration: grid geometry and slots keyed by
 * id, each carrying its placement and, optionally, the widget definition
 * that fills it. A slot's widget fit is checked where the user maps it to
 * its feature composable, on the `use*` line that instances it. Pure data,
 * storable in a constant via `defineWorkspace`; interactivity attaches at
 * `useWorkspace`. Slots without a widget render through their Vue slot
 * only.
 */
export type WorkspaceDefinition = {
  columns: number;
  rows: number;
  slots: Record<string, Slot>;
};

/**
 * The live workspace — what `useWorkspace` returns and the component
 * renders: the layout it lays out, the id-keyed registry at full type, and
 * the typed services record for imperative page access. Fully typed end to
 * end; the component widens `widgets` to the erased record on its render
 * path.
 */
export type Workspace<R extends Widgets> = {
  layout: WorkspaceDefinition;
  widgets: R;
  services: ServicesOf<R>;
};

export type WorkspacePassthrough = {
  root: Passthrough<GroupProps>;
  header: Passthrough<HeaderProps>;
  grid: Passthrough<GroupProps>;
  slot: PassthroughIter<Slot & { id: string }, GroupProps>;
  footer: Passthrough<FooterProps>;
};

export type WorkspaceProps<R extends Widgets> = {
  workspace: Workspace<R>;
  pt?: PT<WorkspacePassthrough>;
};

export type WorkspaceContext<R extends Widgets> = {
  workspace: Workspace<R>;
  el: ComponentPublicInstance | null;
  settings: WorkspacePassthrough;
};

export type WorkspaceSlotContext<R extends Widgets> = WorkspaceContext<R> & {
  id: string;
  slot: Slot;
};

/**
 * Grid cells are addressed two ways: `slot:<id>` overrides a cell
 * wholesale, `widget:<id>` overrides how the cell's widget renders and
 * receives its typed service.
 */
export type WorkspaceSlots<R extends Widgets> = {
  header?: (props: WorkspaceContext<R>) => VNode[];
  footer?: (props: WorkspaceContext<R>) => VNode[];
} & {
  [name: `slot:${string}`]:
    | ((props: WorkspaceSlotContext<R>) => VNode[])
    | undefined;
} & {
  [K in keyof R as `widget:${K & string}`]?: (
    props: WorkspaceSlotContext<R> & { service: R[K]["service"] },
  ) => VNode[];
};
