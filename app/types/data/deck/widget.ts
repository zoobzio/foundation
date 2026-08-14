import type { GroupProps } from "../../common/group";
import type { FabProps, FabEmits } from "../../core/fab";
import type { Passthrough, PT } from "../../passthrough";
import type { Service, Events } from "../deck";
import type {
  DeckFeedPassthrough,
  DeckFeedSlots,
} from "./feed";
import type { DeckToolbarPassthrough } from "./toolbar";
import type { ComponentPublicInstance, VNode } from "vue";

export type DeckWidgetPassthrough = {
  root: Passthrough<GroupProps>;
  body: Passthrough<GroupProps>;
  pending: Passthrough<FabProps, FabEmits>;
};

export type DeckWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<DeckWidgetPassthrough> & {
    toolbar?: PT<DeckToolbarPassthrough>;
    feed?: PT<DeckFeedPassthrough>;
  };
};

export type DeckWidgetEmits = {
  updated: Parameters<Events["deck:updated"]>;
  polled: Parameters<Events["deck:polled"]>;
};

export type DeckWidgetContext<T> = {
  deck: Service<T>;
  el: ComponentPublicInstance | null;
  settings: DeckWidgetPassthrough;
};

export type DeckWidgetSlots<T> = DeckFeedSlots<T> & {
  toolbar?: (props: DeckWidgetContext<T>) => VNode[];
  pending?: (props: DeckWidgetContext<T>) => VNode[];
};
