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
  Workspace,
  Events,
} from "#foundation/types/system/workspace";
import type { ComponentPublicInstance, VNode } from "vue";

export type WorkspaceStructurePassthrough = {
  root: Passthrough<GroupProps>;
  header: Passthrough<HeaderProps>;
  grid: Passthrough<GroupProps>;
  slot: PassthroughIter<Slot, GroupProps>;
  footer: Passthrough<FooterProps>;
};

export type WorkspaceStructureProps = {
  workspace: Workspace;
  pt?: PT<WorkspaceStructurePassthrough>;
};

export type WorkspaceStructureEmits = {
  initialized: Parameters<Events["workspace:initialized"]>;
};

export type WorkspaceStructureContext = {
  workspace: Workspace;
  el: ComponentPublicInstance | null;
  settings: WorkspaceStructurePassthrough;
};

export type WorkspaceSlotContext = WorkspaceStructureContext & {
  slot: Slot;
};

/**
 * Layout slots are addressed by id through the template-literal slot:
 * `slot:<id>` renders into the grid cell the layout assigns that id.
 */
export type WorkspaceStructureSlots = {
  header?: (props: WorkspaceStructureContext) => VNode[];
  footer?: (props: WorkspaceStructureContext) => VNode[];
} & {
  [name: `slot:${string}`]:
    | ((props: WorkspaceSlotContext) => VNode[])
    | undefined;
};
