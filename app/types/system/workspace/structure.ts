import type { FooterProps } from "#foundation/types/common/footer";
import type { GroupProps } from "#foundation/types/common/group";
import type { HeaderProps } from "#foundation/types/common/header";
import type {
  Passthrough,
  PassthroughIter,
  PT,
} from "#foundation/types/passthrough";
import type {
  Slot,
  Service,
  Events,
} from "#foundation/types/system/workspace";
import type { Widgets } from "#foundation/types/widget";
import type { ComponentPublicInstance, VNode } from "vue";

export type WorkspaceStructurePassthrough<R extends Widgets> = {
  root: Passthrough<GroupProps>;
  header: Passthrough<HeaderProps>;
  grid: Passthrough<GroupProps>;
  slot: PassthroughIter<Slot<R>, GroupProps>;
  footer: Passthrough<FooterProps>;
};

export type WorkspaceStructureProps<R extends Widgets> = {
  service: Service<R>;
  pt?: PT<WorkspaceStructurePassthrough<R>>;
};

export type WorkspaceStructureEmits = {
  initialized: Parameters<Events["workspace:initialized"]>;
};

export type WorkspaceStructureContext<R extends Widgets> = {
  workspace: Service<R>;
  el: ComponentPublicInstance | null;
  settings: WorkspaceStructurePassthrough<R>;
};

export type WorkspaceSlotContext<R extends Widgets> =
  WorkspaceStructureContext<R> & {
    slot: Slot<R>;
  };

/**
 * Layout regions are addressed two ways: `slot:<id>` overrides a grid cell
 * wholesale, `widget:<key>` overrides how a registry widget renders and
 * receives its typed service.
 */
export type WorkspaceStructureSlots<R extends Widgets> = {
  header?: (props: WorkspaceStructureContext<R>) => VNode[];
  footer?: (props: WorkspaceStructureContext<R>) => VNode[];
} & {
  [name: `slot:${string}`]:
    | ((props: WorkspaceSlotContext<R>) => VNode[])
    | undefined;
} & {
  [K in keyof R as `widget:${K & string}`]?: (
    props: WorkspaceSlotContext<R> & { service: ReturnType<R[K]>["service"] },
  ) => VNode[];
};
