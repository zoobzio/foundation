import type { Ref } from "#imports";
import type { Widgets } from "#foundation/types/widget";

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
 * the registry so the layout stays serializable.
 */
export interface Layout<R extends Widgets = Widgets> {
  columns: number;
  rows: number;
  slots: Slot<R>[];
}

/**
 * Config the consumer provides to the factory: the widget registry and the
 * layout that places it.
 */
export type Config<R extends Widgets> = {
  layout: Layout<R>;
  widgets: R;
};

export type State<R extends Widgets> = {
  initialized: Ref<boolean>;
  loading: Ref<boolean>;
  layout: Ref<Layout<R>>;
};

/**
 * Optional consumer side effects hooked into the workspace lifecycle.
 */
export type Actions<R extends Widgets> = {
  init?: (service: Service<R>) => Promise<void>;
};

export type Service<R extends Widgets> = {
  readonly id: string;
  readonly config: Config<R>;

  readonly initialized: boolean;
  readonly loading: boolean;
  readonly layout: Layout<R>;

  readonly gridStyle: Record<string, string>;
  slotStyle(slot: Slot<R>): Record<string, string>;

  init(): Promise<boolean>;
};

export type Events = {
  "workspace:initialized": (event: { id: string }) => void;
};
