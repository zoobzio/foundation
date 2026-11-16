import type { BrowserSortItem } from "../types/components/browser";
import type { BrowserCrumbItem } from "../types/components/browser-head";
import type { BrowserColumn, Service } from "@zoobzio/browser";

/**
 * The browser's trail as breadcrumb items. Each item carries its trail
 * index, which is what `navigate` takes when the crumb is selected, and the
 * crumb's `link`, which renders it as an anchor.
 */
export const crumbItems = <T>(browser: Service<T>): BrowserCrumbItem[] =>
  browser.trail.map((crumb, index) => ({
    key: crumb.key,
    label: crumb.label,
    link: crumb.link,
    index,
  }));

/**
 * A sortable column as an item of the sort menu. Its key is the column's
 * sort field, which `sortBy` takes when the item is selected. The column's
 * properties beyond the ones the browser and its views read (what a layer
 * widens it with, such as an icon) are carried onto the item, so the menu
 * draws the column as the search does.
 */
export const sortItem = <T>(
  browser: Service<T>,
  column: BrowserColumn<T>,
): BrowserSortItem => {
  const {
    key: _key,
    label,
    type: _t,
    align: _a,
    sortable: _s,
    sortKey: _k,
    filterable: _f,
    operators: _o,
    defaultOperator: _d,
    values: _v,
    ...rest
  } = column;
  return { ...rest, key: browser.sortFieldFor(column), label };
};

/**
 * The browser's sortable columns as the items of its sort menu.
 */
export const sortItems = <T>(browser: Service<T>): BrowserSortItem[] =>
  browser.sortableColumns.map((column) => sortItem(browser, column));

/**
 * The listing in words: how many folders and how many files the current
 * folder shows.
 */
export const listingSummary = <T>(browser: Service<T>): string => {
  const folders = browser.folders.length;
  const files = browser.files.length;
  return `${folders} ${folders === 1 ? "folder" : "folders"}, ${files} ${files === 1 ? "file" : "files"}`;
};
