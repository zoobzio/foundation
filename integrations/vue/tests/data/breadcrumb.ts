import type { BreadcrumbItem } from "../../src/types/core/breadcrumb";

/**
 * A breadcrumb item with a consumer field.
 */
export type FakeCrumb = BreadcrumbItem & {
  depth: number;
};

/**
 * A trail with a linked root, a disabled item, and a terminal item.
 */
export const fakeCrumbs: FakeCrumb[] = [
  { key: "root", label: "Home", depth: 0, link: { to: "/" } },
  { key: "docs", label: "Docs", depth: 1 },
  { key: "legacy", label: "Legacy", depth: 2, disabled: true },
  { key: "current", label: "Current Page", depth: 3 },
];
