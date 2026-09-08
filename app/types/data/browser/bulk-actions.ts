import type { Service } from "../browser";

export type BrowserBulkActionsProps<T> = {
  browser: Service<T>;
};

export type BrowserBulkActionsContext<T> = {
  browser: Service<T>;
  el: HTMLDivElement | null;
};
