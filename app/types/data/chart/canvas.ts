import type { Service } from "../chart";

export type ChartCanvasProps<T> = {
  chart: Service<T>;
};

export type ChartCanvasContext<T> = {
  chart: Service<T>;
  el: HTMLDivElement | null;
};
