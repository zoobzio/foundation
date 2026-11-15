import type { DialogEmits, DialogProps } from "./dialog";
import type { FabEmits, FabProps } from "./fab";
import type { MenuEmits, MenuGroup, MenuItem, MenuProps } from "./menu";
import type { TabsEmits, TabsOption, TabsProps } from "./tabs";
import type { PT, Rendered, RenderedIter } from "../passthrough";
import type { Definition } from "../definition";
import type { VIEWS_ACTIONS } from "../../constants/views";
import type { Events, Intent, Origin, Service } from "@zoobzio/views";
import type { Ref, VNode } from "vue";

/**
 * A view as a tab: its id and name, where it comes from, and whether it
 * is the active view with edits not yet saved.
 */
export interface ViewsTab extends TabsOption {
  origin: Origin;
  drifted: boolean;
}

/**
 * An action on the active view, as a menu item. An action the view does
 * not allow, or that has nothing to do, is disabled.
 */
export interface ViewsAction extends MenuItem {
  key: (typeof VIEWS_ACTIONS)[number];
}

/**
 * The name being typed: for a new view, or for the active one.
 */
export type ViewsNaming = {
  mode: "saveAs" | "rename";
  name: string;
};

/**
 * The parts of the views that accept passthrough. `tabs` lists the views
 * and selects one; `menu` holds the actions of the active view behind its
 * `trigger`; `confirm` is the dialog a pending intent opens, built for the
 * intent's kind, and `naming` the one that names a view, built for what
 * the name is for.
 */
export type ViewsPassthrough = {
  tabs: Rendered<TabsProps<ViewsTab>, TabsEmits>;
  menu: Rendered<MenuProps<ViewsAction>, MenuEmits<ViewsAction>>;
  trigger: Rendered<FabProps, FabEmits>;
  confirm: RenderedIter<Intent["kind"], DialogProps, DialogEmits>;
  naming: RenderedIter<ViewsNaming["mode"], DialogProps, DialogEmits>;
};

/**
 * Props of the views: the headless service plus passthrough. The service's
 * state container must be reactive for the views to update, and its `read`
 * action must read reactive state for the drift to show.
 */
export type ViewsProps<P> = {
  service: Service<P>;
  pt?: PT<ViewsPassthrough>;
};

/**
 * Emits of the views: the service's domain events, relayed with the
 * service's payloads. Literal keys, not a `Pick`: `@vue/compiler-sfc` must
 * fold the emit keys statically for `defineEmits`. `VIEWS_EVENTS` names the
 * relayed subset and is checked against these keys.
 */
export type ViewsEmits<P> = {
  selected: Events<P>["selected"];
  saved: Events<P>["saved"];
  renamed: Events<P>["renamed"];
  removed: Events<P>["removed"];
  reverted: Events<P>["reverted"];
  failed: Events<P>["failed"];
};

/**
 * The views view model, served to `defineExpose` and the slots. `naming`
 * is the name being typed in the naming dialog, and `name` the one typed
 * in the confirmation, where saving a view that is not the user's makes a
 * new one.
 */
export type ViewsContext<P> = {
  views: Service<P>;
  tabs: ViewsTab[];
  groups: MenuGroup<ViewsAction>[];
  naming: Ref<ViewsNaming | null>;
  name: Ref<string>;
  el: HTMLDivElement | null;
  settings: ViewsPassthrough;
};

/**
 * Slots of the views. Each slot receives the context; a tab slot also its
 * `option`, an action slot its `item`, and `proceedLabel` the `kind` of
 * the intent its button carries out.
 */
export type ViewsSlots<P> = {
  tabPrepend?: (props: ViewsContext<P> & { option: ViewsTab }) => VNode[];
  tabLabel?: (props: ViewsContext<P> & { option: ViewsTab }) => VNode[];
  badge?: (props: ViewsContext<P> & { option: ViewsTab }) => VNode[];
  trigger?: (props: ViewsContext<P>) => VNode[];
  actionPrepend?: (props: ViewsContext<P> & { item: ViewsAction }) => VNode[];
  actionLabel?: (props: ViewsContext<P> & { item: ViewsAction }) => VNode[];
  actionAppend?: (props: ViewsContext<P> & { item: ViewsAction }) => VNode[];
  nameLabel?: (props: ViewsContext<P>) => VNode[];
  cancelLabel?: (props: ViewsContext<P>) => VNode[];
  saveLabel?: (props: ViewsContext<P>) => VNode[];
  proceedLabel?: (props: ViewsContext<P> & { kind: Intent["kind"] }) => VNode[];
};

/**
 * A views instance as data: props plus emit listeners.
 */
export type ViewsDefinition<P> = Definition<ViewsProps<P>, ViewsEmits<P>>;
