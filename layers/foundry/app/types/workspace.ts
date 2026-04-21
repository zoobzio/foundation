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
