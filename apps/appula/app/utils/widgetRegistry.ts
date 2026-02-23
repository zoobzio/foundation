import type { Component } from "vue";
import type { WidgetRegistry } from "../types/dashboard";

const widgets = new Map<string, Component>();

export const widgetRegistry: WidgetRegistry = {
  register: (variant: string, component: Component) => {
    widgets.set(variant, component);
  },
  resolve: (variant: string) => widgets.get(variant),
  has: (variant: string) => widgets.has(variant),
};
