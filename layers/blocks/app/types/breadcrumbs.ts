import type { breadcrumbs } from "../../elements.config";

export type BreadcrumbsProps = {
  items: Link[];
  separator?: IconAlias;
  tokens?: Tokens<
    | typeof breadcrumbs.root
    | typeof breadcrumbs.list
    | typeof breadcrumbs.item
    | typeof breadcrumbs.link
    | typeof breadcrumbs.current
    | typeof breadcrumbs.separator
  >;
};

export type BreadcrumbsEmits = {};

export const defineBreadcrumbs = useComponentRecipe<BreadcrumbsProps, BreadcrumbsEmits>();
