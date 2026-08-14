import type { GroupProps } from "../../common/group";
import type { SpanProps } from "../../common/span";
import type { FabProps, FabEmits } from "../../core/fab";
import type { Passthrough, PT } from "../../passthrough";
import type { Service, Events } from "../preview";
import type { ComponentPublicInstance, VNode } from "vue";

export type PreviewWidgetPassthrough = {
  root: Passthrough<GroupProps>;
  toolbar: Passthrough<GroupProps>;
  title: Passthrough<SpanProps>;
  actions: Passthrough<GroupProps>;
  external: Passthrough<FabProps, FabEmits>;
  copy: Passthrough<FabProps, FabEmits>;
  download: Passthrough<FabProps, FabEmits>;
  body: Passthrough<GroupProps>;
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
  el: ComponentPublicInstance | null;
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
