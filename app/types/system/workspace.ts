import type { ComputedRef, Ref } from "#imports";

/**
 * A slot definition within a workspace layout.
 */
export interface Slot {
  id: string;
  position: [column: number, row: number];
  span: [columns: number, rows: number];
}

/**
 * Workspace layout — a grid of slots.
 */
export interface Layout {
  columns: number;
  rows: number;
  slots: Slot[];
}

/**
 * Config the consumer provides to the factory — pure data.
 */
export type Config = {
  layout: Layout;
};

export type State = {
  initialized: Ref<boolean>;
  loading: Ref<boolean>;
  layout: Ref<Layout>;
};

/**
 * Optional consumer side effects hooked into the workspace lifecycle.
 */
export type Actions = {
  init?: (service: Service) => Promise<void>;
};

export type Service = {
  readonly id: string;
  readonly config: Config;

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly layout: Layout;

  readonly gridStyle: Record<string, string>;
  slotStyle(slot: Slot): Record<string, string>;

  init(): Promise<boolean>;
};

export type Events = {
  "workspace:initialized": (event: { id: string }) => void;
};

/**
 * The reactive facade returned by the factory. The widget's prop.
 */
export type Workspace = {
  id: string;
  config: Config;

  initialized: Ref<boolean>;
  loading: Ref<boolean>;
  layout: Ref<Layout>;

  gridStyle: ComputedRef<Record<string, string>>;
  slotStyle: (slot: Slot) => Record<string, string>;

  init: () => Promise<boolean>;
};
