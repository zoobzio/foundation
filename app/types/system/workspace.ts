import type { FooterProps } from "#foundation/types/common/footer";
import type { GroupProps } from "#foundation/types/common/group";
import type { HeaderProps } from "#foundation/types/common/header";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type { Wiring } from "#foundation/types/spec";
import type { Widgets } from "#foundation/types/widget";
import type { ComponentPublicInstance, VNode } from "vue";

/**
 * A slot definition within a workspace layout. `widget` assigns a registry
 * key to the cell; unassigned slots render through the Vue slot only.
 */
export interface Slot<R extends Widgets = Widgets> {
  id: string;
  widget?: keyof R;
  position: [column: number, row: number];
  span: [columns: number, rows: number];
}

/**
 * Workspace layout — a grid of slots. Plain data; `widget` keys reference
 * the spec's registry so the layout stays serializable.
 */
export interface Layout<R extends Widgets = Widgets> {
  columns: number;
  rows: number;
  slots: Slot<R>[];
}

/**
 * The complete page description a workspace renders: what exists
 * (`widgets`), where it goes (`layout`), how it talks to itself (`wire`).
 * Built at module scope with `defineWorkspace` — pure data, no runtime.
 */
export type WorkspaceSpec<R extends Widgets> = {
  widgets: R;
  layout: Layout<R>;
  wire?: Wiring<R>;
};

export type WorkspacePassthrough<R extends Widgets> = {
  root: Passthrough<GroupProps>;
  header: Passthrough<HeaderProps>;
  grid: Passthrough<GroupProps>;
  slot: PassthroughIter<Slot<R>, GroupProps>;
  footer: Passthrough<FooterProps>;
};

export type WorkspaceProps<R extends Widgets> = {
  spec: WorkspaceSpec<R>;
  pt?: PT<WorkspacePassthrough<R>>;
};

export type WorkspaceContext<R extends Widgets> = {
  spec: WorkspaceSpec<R>;
  el: ComponentPublicInstance | null;
  settings: WorkspacePassthrough<R>;
};

export type WorkspaceSlotContext<R extends Widgets> = WorkspaceContext<R> & {
  slot: Slot<R>;
};

/**
 * Layout regions are addressed two ways: `slot:<id>` overrides a grid cell
 * wholesale, `widget:<key>` overrides how a registry widget renders and
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
    props: WorkspaceSlotContext<R> & { service: ReturnType<R[K]>["service"] },
  ) => VNode[];
};
