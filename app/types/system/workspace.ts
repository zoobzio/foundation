import type { ComputedRef, Ref } from "#imports";
import type { FooterProps } from "#foundation/types/common/footer";
import type { GroupProps } from "#foundation/types/common/group";
import type { HeaderProps } from "#foundation/types/common/header";
import type { Passthrough } from "#foundation/types/core/passthrough";
import type { PageSlot } from "#foundation/types/system/page";
/**
 * Workspace layout — a grid with header and footer.
 */
export interface WorkspaceLayout {
  columns: number;
  rows: number;
  slots: PageSlot[];
}

/**
 * Factory config for createWorkspace.
 */
export interface WorkspaceFactoryConfig {
  layout: WorkspaceLayout;
}

/**
 * The reactive interface for a workspace.
 * Returned by the factory. Components accept this.
 */
export interface Workspace {
  // Reactive state
  initialized: Ref<boolean>;
  loading: Ref<boolean>;

  // Layout
  layout: Ref<WorkspaceLayout>;
  gridStyle: ComputedRef<Record<string, string>>;

  // Actions
  slotStyle: (slot: PageSlot) => Record<string, string>;
  init: () => Promise<boolean>;
}

/**
 * Workspace component passthrough.
 */
export type WorkspacePassthrough = {
  root?: Passthrough<GroupProps>;
  header?: Passthrough<HeaderProps>;
  grid?: Passthrough<GroupProps>;
  footer?: Passthrough<FooterProps>;
};

/**
 * Workspace component props.
 */
export type WorkspaceProps = {
  workspace: Workspace;
  pt?: WorkspacePassthrough;
};
