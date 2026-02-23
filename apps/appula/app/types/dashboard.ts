import type { Component } from "vue";

export interface WidgetConfig {
  variant: string;
  props?: Record<string, unknown>;
}

export interface PanelConfig {
  id: string;
  size?: number;
  minSize?: number;
  nested?: SplitterLayout;
  widget?: WidgetConfig;
}

export interface SplitterLayout {
  direction: "horizontal" | "vertical";
  panels: PanelConfig[];
}

export type DashboardConfig = SplitterLayout;

export interface WidgetRegistry {
  register: (variant: string, component: Component) => void;
  resolve: (variant: string) => Component | undefined;
  has: (variant: string) => boolean;
}
