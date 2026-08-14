import type { Reshape } from "../../reshape";
import type { VNode } from "vue";
import type { ToastProviderProps as RekaToastProviderProps } from "reka-ui";

export type ToastProviderProps = RekaToastProviderProps;

export type ToastProviderContext = Reshape<ToastProviderProps>;

export type ToastProviderSlots = {
  default(props: ToastProviderContext): VNode[];
};
