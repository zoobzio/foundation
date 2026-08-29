import type { FabProps, FabEmits } from "../../core/fab";
import type { Passthrough, PT } from "../../passthrough";
import type { Service, Events } from "../preview";
import type { VNode } from "vue";

export type PreviewWidgetPassthrough = {
  external: Passthrough<FabProps, FabEmits>;
  copy: Passthrough<FabProps, FabEmits>;
  download: Passthrough<FabProps, FabEmits>;
};

export type PreviewWidgetProps<T> = {
  service: Service<T>;
  pt?: PT<PreviewWidgetPassthrough>;
};

export type PreviewWidgetEmits = {
  loaded: Parameters<Events["preview:loaded"]>;
};

export type PreviewWidgetContext<T> = {
  preview: Service<T>;
  el: HTMLDivElement | null;
  settings: PreviewWidgetPassthrough;
};

export type PreviewWidgetSlots<T> = {
  loading?: (props: PreviewWidgetContext<T>) => VNode[];
  empty?: (props: PreviewWidgetContext<T>) => VNode[];
  toolbar?: (props: PreviewWidgetContext<T>) => VNode[];
  title?: (props: PreviewWidgetContext<T>) => VNode[];
  actions?: (props: PreviewWidgetContext<T>) => VNode[];
  body?: (props: PreviewWidgetContext<T>) => VNode[];
};
