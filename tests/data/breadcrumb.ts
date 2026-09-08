import type { BreadcrumbItem } from "../../app/types/core/breadcrumb";

/** Consumer item type: extends the base with an extra field, echoed back
 *  through the select emit. */
export type FakeCrumb = BreadcrumbItem & {
  depth: number;
};

export const fakeCrumbs: FakeCrumb[] = [
  { key: "root", label: "Home", icon: "home", depth: 0, link: { to: "/" } },
  { key: "docs", label: "Docs", depth: 1 },
  { key: "legacy", label: "Legacy", depth: 2, disabled: true },
  { key: "current", label: "Current Page", depth: 3 },
];
