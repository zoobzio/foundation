import type { BrowserCrumbItem } from "../types/components/browser";
import type { Service } from "@zoobzio/browser";

/**
 * The browser's trail as breadcrumb items. Each item carries its trail
 * index, which is what `navigate` takes when the crumb is selected.
 */
export const crumbItems = <T>(browser: Service<T>): BrowserCrumbItem[] =>
  browser.trail.map((crumb, index) => ({
    key: crumb.key,
    label: crumb.label,
    index,
  }));
