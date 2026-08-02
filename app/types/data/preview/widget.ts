import type { GroupProps } from "#foundation/types/common/group";
import type { SpanProps } from "#foundation/types/common/span";
import type { FabProps, FabEmits } from "#foundation/types/core/fab";
import type { Passthrough, PT } from "#foundation/types/passthrough";
import type { Preview, Events } from "#foundation/types/data/preview";
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
  preview: Preview<T>;
  pt?: PT<PreviewWidgetPassthrough>;
};

export type PreviewWidgetEmits = {
  loaded: Parameters<Events["preview:loaded"]>;
};

export type PreviewWidgetContext<T> = {
  preview: Preview<T>;
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
